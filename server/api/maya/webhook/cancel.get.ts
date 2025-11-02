/**
 * Maya Payment Cancel Redirect (GET)
 * Handles when user cancels the payment
 */

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    console.log('⚠️ Maya Cancel Redirect (GET):', query)
    
    // Redirect user back to patient billing page
    return sendRedirect(event, '/patient/billing?payment=cancelled', 302)
    
  } catch (error) {
    console.error('❌ Maya Redirect Error:', error)
    return sendRedirect(event, '/patient/billing?payment=error', 302)
  }
})
