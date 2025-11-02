/**
 * Maya Payment Failure Webhook
 * Handles failed payment notifications from Maya
 */

import { mayaService } from '~/server/services/maya-payment.service'
import { PrismaClient as InstancePrismaClient } from '@/prisma/generated/instance/client'

const instancePrisma = new InstancePrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get raw body for signature verification
    const body = await readBody(event)
    const signature = getHeader(event, 'paymaya-signature') || ''
    
    // Verify webhook signature
    const isValid = mayaService.verifyWebhookSignature(JSON.stringify(body), signature)
    
    if (!isValid) {
      console.error('❌ Invalid webhook signature')
      return {
        statusCode: 401,
        body: { error: 'Invalid signature' },
      }
    }

    console.log('⚠️  Maya Payment Failed:', body)

    const { id: checkoutId, requestReferenceNumber } = body

    // Find the billing payment by reference number
    const payment = await instancePrisma.billingPayment.findFirst({
      where: {
        paymentNumber: requestReferenceNumber,
      },
    })

    if (!payment) {
      console.error('❌ Payment not found:', requestReferenceNumber)
      return {
        statusCode: 404,
        body: { error: 'Payment not found' },
      }
    }

    // Update payment status
    await instancePrisma.billingPayment.update({
      where: { id: payment.id },
      data: {
        status: 'FAILED',
        mayaPaymentId: checkoutId,
        mayaPaymentStatus: 'PAYMENT_FAILED',
      },
    })

    console.log('⚠️  Payment marked as failed:', requestReferenceNumber)

    // Redirect user to patient billing page with error message
    return sendRedirect(event, '/patient/billing?payment=failed', 302)
  } catch (error) {
    console.error('❌ Maya Webhook Error:', error)
    return sendRedirect(event, '/patient/billing?payment=error', 302)
  }
})
