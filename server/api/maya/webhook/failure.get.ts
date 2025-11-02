/**
 * Maya Payment Failure Redirect (GET)
 * Handles when Maya redirects the user back after failed payment
 */

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    console.log('⚠️ Maya Failure Redirect (GET):', query)
    
    // Redirect user to patient billing page with failure message
    return sendRedirect(event, '/patient/billing?payment=failed', 302)
    
  } catch (error) {
    console.error('❌ Maya Redirect Error:', error)
    return sendRedirect(event, '/patient/billing?payment=error', 302)
  }
})
