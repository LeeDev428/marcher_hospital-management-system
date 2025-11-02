/**
 * Simple Maya Payment Test Endpoint
 * Visit: http://localhost:3000/api/test-maya
 * 
 * This creates a test payment and returns the checkout URL.
 * Open the checkout URL in your browser to complete the test payment.
 */

import { mayaService } from '~/server/services/maya-payment.service'

export default defineEventHandler(async (event) => {
  try {
    console.log('🧪 Testing Maya Payment Service...')
    console.log('📝 Maya Config:', {
      sandboxMode: process.env.MAYA_SANDBOX_MODE,
      apiUrl: process.env.MAYA_API_BASE_URL,
      hasPublicKey: !!process.env.MAYA_PUBLIC_KEY,
      hasSecretKey: !!process.env.MAYA_SECRET_KEY,
      publicKeyPrefix: process.env.MAYA_PUBLIC_KEY?.substring(0, 10),
      secretKeyPrefix: process.env.MAYA_SECRET_KEY?.substring(0, 10),
    })
    
    // Create a simple test payment
    const result = await mayaService.createOneTimePayment({
      amount: 100.00, // ₱100.00 test amount
      description: 'Test Payment - Hospital Billing System',
      buyerName: 'Juan Dela Cruz',
      buyerEmail: 'juan.delacruz@test.com',
      buyerPhone: '09171234567',
      referenceNumber: 'TEST-' + Date.now(),
    })
    
    if (result.success) {
      console.log('✅ Maya checkout created successfully!')
      console.log('🔗 Checkout URL:', result.checkoutUrl)
      console.log('🆔 Checkout ID:', result.checkoutId)
      
      return {
        success: true,
        message: '✅ Maya integration is working!',
        data: {
          checkoutUrl: result.checkoutUrl,
          checkoutId: result.checkoutId,
        },
        instructions: [
          '1. Copy the checkoutUrl below',
          '2. Open it in your browser',
          '3. Use test card: 5123456789012346',
          '4. Expiry: 12/25, CVV: 111',
          '5. OTP: 111111',
          '6. Complete payment and see success page!',
        ],
        testCards: {
          success: {
            card: '5123456789012346',
            expiry: '12/25',
            cvv: '111',
            otp: '111111',
          },
          failure: {
            card: '5123456789012346',
            expiry: '12/25',
            cvv: '222',
            otp: '222222',
          },
        },
      }
    } else {
      console.error('❌ Maya checkout failed:', result.error)
      
      return {
        success: false,
        message: '❌ Maya integration failed',
        error: result.error,
        troubleshooting: [
          'Check if .env file exists and has Maya keys',
          'Verify MAYA_PUBLIC_KEY starts with: pk-Z0OSzLvIcOI2UIvDhdTGVVfRSSeiGStnceqwUE7n0Ah',
          'Verify MAYA_SECRET_KEY starts with: sk-X8qolYjy62kIzEbr0QRK1h4b4KDVHaNcwMYk39jInSl',
          'Check server logs for detailed error',
          'Make sure MAYA_SANDBOX_MODE=true',
        ],
      }
    }
  } catch (error: any) {
    console.error('❌ Error testing Maya:', error)
    
    return {
      success: false,
      message: '❌ Error testing Maya',
      error: error.message,
      stack: error.stack,
      troubleshooting: [
        'Make sure maya-payment.service.ts exists',
        'Check if .env file has Maya configuration',
        'Verify server is running',
        'Check console for detailed error messages',
      ],
    }
  }
})
