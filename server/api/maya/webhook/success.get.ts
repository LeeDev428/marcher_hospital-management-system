/**
 * Maya Payment Success Redirect (GET)
 * Handles when Maya redirects the user back after successful payment
 * ALSO updates the database since POST webhook won't work in localhost
 */

import { PrismaClient as InstancePrismaClient } from '@/prisma/generated/instance/client'

const instancePrisma = new InstancePrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    console.log('✅ Maya Success Redirect (GET):', query)
    
    // Maya sends the checkout ID in the query params
    const checkoutId = query.id as string
    
    // Find the billing payment by Maya checkout ID OR find most recent pending payment
    let payment = null
    
    if (checkoutId) {
      payment = await instancePrisma.billingPayment.findFirst({
        where: {
          mayaPaymentId: checkoutId,
          status: 'PENDING'
        },
        include: {
          transaction: true
        }
      })
    }
    
    // Fallback: Find the most recent pending payment (for testing when checkoutId doesn't match)
    if (!payment) {
      console.log('⚠️ No payment found by checkout ID, trying most recent pending...')
      payment = await instancePrisma.billingPayment.findFirst({
        where: {
          status: 'PENDING',
          paymentMethod: 'MAYA'
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          transaction: true
        }
      })
    }
    
    if (!payment) {
      console.error('❌ No pending Maya payment found')
      return sendRedirect(event, '/patient/billing?payment=error', 302)
    }
    
    console.log('✅ Found pending payment, updating status...')
    console.log(`   Payment ID: ${payment.id}, Transaction: ${payment.transaction.transactionNumber}`)
    
    // Update payment status to COMPLETED
    await instancePrisma.billingPayment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        mayaPaymentStatus: 'PAYMENT_SUCCESS',
        paidAt: new Date(),
      },
    })
    
    // Calculate new totals for the transaction
    const paymentAmount = Number(payment.amount)
    const newPaidAmount = Number(payment.transaction.paidAmount) + paymentAmount
    const newBalanceAmount = Number(payment.transaction.totalAmount) - newPaidAmount
    
    // Determine new status
    let newStatus = payment.transaction.status
    if (newBalanceAmount <= 0) {
      newStatus = 'PAID'
    } else if (newPaidAmount > 0) {
      newStatus = 'PARTIALLY_PAID'
    }
    
    // Update billing transaction
    await instancePrisma.billingTransaction.update({
      where: { id: payment.transaction.id },
      data: {
        status: newStatus,
        paidAmount: newPaidAmount.toString(),
        balanceAmount: newBalanceAmount.toString(),
      },
    })
    
    console.log('✅ Payment updated successfully!')
    console.log(`   Transaction: ${payment.transaction.transactionNumber}`)
    console.log(`   Amount: ${paymentAmount}, New Balance: ${newBalanceAmount}, Status: ${newStatus}`)
    
    // Redirect user to patient billing page with success message
    return sendRedirect(event, '/patient/billing?payment=success', 302)
    
  } catch (error) {
    console.error('❌ Maya Redirect Error:', error)
    return sendRedirect(event, '/patient/billing?payment=error', 302)
  }
})
