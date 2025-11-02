/**
 * Maya Payment Success Webhook
 * Handles successful payment notifications from Maya
 */

import { mayaService } from '~/server/services/maya-payment.service'
import { PrismaClient as InstancePrismaClient } from '@/prisma/generated/instance/client'

const instancePrisma = new InstancePrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get raw body
    const body = await readBody(event)
    
    console.log('✅ Maya Payment Success Webhook (POST):', JSON.stringify(body, null, 2))

    const { id: checkoutId, requestReferenceNumber, paymentDetails } = body

    if (!requestReferenceNumber) {
      console.error('❌ No requestReferenceNumber in webhook body')
      return { statusCode: 400, body: { error: 'Missing reference number' } }
    }

    // Find the billing transaction by transaction number (TXN-YYYY-XXXXXX)
    const billingTransaction = await instancePrisma.billingTransaction.findFirst({
      where: {
        transactionNumber: requestReferenceNumber,
      },
      include: {
        payments: true,
      },
    })

    if (!billingTransaction) {
      console.error('❌ Transaction not found:', requestReferenceNumber)
      return { statusCode: 404, body: { error: 'Transaction not found' } }
    }

    // Find the pending payment for this transaction
    const payment = await instancePrisma.billingPayment.findFirst({
      where: {
        transactionId: billingTransaction.id,
        status: 'PENDING',
      },
    })

    if (!payment) {
      console.error('❌ Payment not found for transaction:', requestReferenceNumber)
      return { statusCode: 404, body: { error: 'Payment not found' } }
    }

    // Update payment status to COMPLETED
    await instancePrisma.billingPayment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        mayaPaymentId: checkoutId,
        mayaPaymentStatus: 'PAYMENT_SUCCESS',
        paidAt: new Date(),
      },
    })

    // Calculate new totals for the transaction
    const paymentAmount = Number(payment.amount)
    const newPaidAmount = Number(billingTransaction.paidAmount) + paymentAmount
    const newBalanceAmount = Number(billingTransaction.totalAmount) - newPaidAmount
    
    // Determine new status
    let newStatus = billingTransaction.status
    if (newBalanceAmount <= 0) {
      newStatus = 'PAID'
    } else if (newPaidAmount > 0) {
      newStatus = 'PARTIALLY_PAID'
    }

    // Update billing transaction
    await instancePrisma.billingTransaction.update({
      where: { id: billingTransaction.id },
      data: {
        status: newStatus,
        paidAmount: newPaidAmount.toString(),
        balanceAmount: newBalanceAmount.toString(),
      },
    })

    console.log('✅ Payment processed successfully for:', requestReferenceNumber)
    console.log(`   Amount: ${paymentAmount}, New Balance: ${newBalanceAmount}, Status: ${newStatus}`)

    return { statusCode: 200, body: { success: true } }
  } catch (error) {
    console.error('❌ Maya Webhook Error:', error)
    // Redirect to billing page with error message
    return sendRedirect(event, '/patient/billing?payment=error', 302)
  }
})
