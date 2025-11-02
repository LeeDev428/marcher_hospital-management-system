/**
 * Maya Payment Gateway Integration
 * Documentation: https://developers.paymaya.com/
 */

import { Buffer } from 'buffer'

interface MayaConfig {
  publicKey: string
  secretKey: string
  sandboxMode: boolean
  apiBaseUrl: string
}

interface PaymentDetails {
  amount: number
  currency?: string
  description: string
  buyerName: string
  buyerEmail: string
  buyerPhone?: string
  referenceNumber: string
}

interface RecurringPaymentSetup {
  amount: number
  currency?: string
  description: string
  interval: 'WEEK' | 'MONTH'
  intervalCount: number
  buyerName: string
  buyerEmail: string
  buyerPhone?: string
  referenceNumber: string
}

class MayaPaymentService {
  private config: MayaConfig

  constructor() {
    this.config = {
      publicKey: process.env.MAYA_PUBLIC_KEY || '',
      secretKey: process.env.MAYA_SECRET_KEY || '',
      sandboxMode: process.env.MAYA_SANDBOX_MODE === 'true',
      apiBaseUrl: process.env.MAYA_API_BASE_URL || 'https://pg-sandbox.paymaya.com',
    }

    if (!this.config.publicKey || !this.config.secretKey) {
      console.warn('⚠️  Maya API keys not configured. Please add MAYA_PUBLIC_KEY and MAYA_SECRET_KEY to .env')
    }
  }

  /**
   * Generate authorization header
   */
  private getAuthHeader(usePublicKey: boolean = false): string {
    const key = usePublicKey ? this.config.publicKey : this.config.secretKey
    const encoded = Buffer.from(`${key}:`).toString('base64')
    return `Basic ${encoded}`
  }

  /**
   * Create One-Time Payment Checkout
   */
  async createOneTimePayment(details: PaymentDetails): Promise<{
    success: boolean
    checkoutUrl?: string
    checkoutId?: string
    error?: string
  }> {
    try {
      const response = await fetch(`${this.config.apiBaseUrl}/checkout/v1/checkouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader(true), // Use public key
        },
        body: JSON.stringify({
          totalAmount: {
            value: details.amount,
            currency: details.currency || 'PHP',
          },
          buyer: {
            firstName: details.buyerName.split(' ')[0] || 'Guest',
            lastName: details.buyerName.split(' ').slice(1).join(' ') || 'User',
            contact: {
              email: details.buyerEmail,
              phone: details.buyerPhone || '',
            },
          },
          items: [
            {
              name: details.description,
              quantity: 1,
              totalAmount: {
                value: details.amount,
              },
            },
          ],
          requestReferenceNumber: details.referenceNumber,
          redirectUrl: {
            success: process.env.MAYA_WEBHOOK_SUCCESS_URL,
            failure: process.env.MAYA_WEBHOOK_FAILURE_URL,
            cancel: process.env.MAYA_WEBHOOK_CANCEL_URL,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Maya API Error:', data)
        return {
          success: false,
          error: data.message || 'Failed to create payment checkout',
        }
      }

      return {
        success: true,
        checkoutUrl: data.redirectUrl,
        checkoutId: data.checkoutId,
      }
    } catch (error) {
      console.error('Maya Payment Error:', error)
      return {
        success: false,
        error: 'Network error while creating payment',
      }
    }
  }

  /**
   * Create Recurring Payment Subscription (for Payment Plans)
   */
  async createRecurringPayment(setup: RecurringPaymentSetup): Promise<{
    success: boolean
    subscriptionId?: string
    checkoutUrl?: string
    error?: string
  }> {
    try {
      // First, create a payment token (customer vault)
      const tokenResponse = await fetch(`${this.config.apiBaseUrl}/payments/v1/payment-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader(true),
        },
        body: JSON.stringify({
          redirectUrl: {
            success: process.env.MAYA_RETURN_URL,
            failure: process.env.MAYA_RETURN_URL,
            cancel: process.env.MAYA_RETURN_URL,
          },
        }),
      })

      const tokenData = await tokenResponse.json()

      if (!tokenResponse.ok) {
        return {
          success: false,
          error: 'Failed to create payment token',
        }
      }

      // Create subscription
      const subscriptionResponse = await fetch(`${this.config.apiBaseUrl}/v1/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader(false), // Use secret key
        },
        body: JSON.stringify({
          totalAmount: {
            value: setup.amount,
            currency: setup.currency || 'PHP',
          },
          frequency: {
            interval: setup.interval,
            count: setup.intervalCount,
          },
          metadata: {
            referenceNumber: setup.referenceNumber,
          },
          customer: {
            firstName: setup.buyerName.split(' ')[0] || 'Guest',
            lastName: setup.buyerName.split(' ').slice(1).join(' ') || 'User',
            email: setup.buyerEmail,
            phone: setup.buyerPhone || '',
          },
        }),
      })

      const subscriptionData = await subscriptionResponse.json()

      if (!subscriptionResponse.ok) {
        return {
          success: false,
          error: 'Failed to create subscription',
        }
      }

      return {
        success: true,
        subscriptionId: subscriptionData.id,
        checkoutUrl: tokenData.verificationUrl,
      }
    } catch (error) {
      console.error('Maya Recurring Payment Error:', error)
      return {
        success: false,
        error: 'Network error while creating recurring payment',
      }
    }
  }

  /**
   * Get Payment Status
   */
  async getPaymentStatus(checkoutId: string): Promise<{
    success: boolean
    status?: 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'PAYMENT_EXPIRED' | 'FOR_AUTHENTICATION'
    data?: any
    error?: string
  }> {
    try {
      const response = await fetch(`${this.config.apiBaseUrl}/v1/checkouts/${checkoutId}`, {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader(false),
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: 'Failed to get payment status',
        }
      }

      return {
        success: true,
        status: data.status,
        data,
      }
    } catch (error) {
      console.error('Maya Get Payment Status Error:', error)
      return {
        success: false,
        error: 'Network error while getting payment status',
      }
    }
  }

  /**
   * Cancel Subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const response = await fetch(
        `${this.config.apiBaseUrl}/v1/subscriptions/${subscriptionId}/cancel`,
        {
          method: 'PUT',
          headers: {
            'Authorization': this.getAuthHeader(false),
          },
        }
      )

      if (!response.ok) {
        return {
          success: false,
          error: 'Failed to cancel subscription',
        }
      }

      return {
        success: true,
      }
    } catch (error) {
      console.error('Maya Cancel Subscription Error:', error)
      return {
        success: false,
        error: 'Network error while canceling subscription',
      }
    }
  }

  /**
   * Verify Webhook Signature (for security)
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const crypto = require('crypto')
      const hmac = crypto.createHmac('sha256', this.config.secretKey)
      hmac.update(payload)
      const calculatedSignature = hmac.digest('hex')
      return calculatedSignature === signature
    } catch (error) {
      console.error('Webhook Signature Verification Error:', error)
      return false
    }
  }
}

// Export singleton instance
export const mayaService = new MayaPaymentService()
