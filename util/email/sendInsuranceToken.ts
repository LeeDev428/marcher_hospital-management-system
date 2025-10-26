import { sendEmail } from './index'

interface SendInsuranceTokenEmailParams {
  to: string
  claimNumber: string
  patientName: string
  accessLink: string
  expiresAt: Date
}

export async function sendInsuranceTokenEmail({
  to,
  claimNumber,
  patientName,
  accessLink,
  expiresAt,
}: SendInsuranceTokenEmailParams) {
  const expirationDate = expiresAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const emailTemplate = {
    from: process.env.SMTP_USERNAME || 'marcher.csb@gmail.com',
    subject: `Insurance Claim Review Request - ${claimNumber}`,
    text: `
Insurance Claim Review Request

Claim Number: ${claimNumber}
Patient Name: ${patientName}

You have been requested to review an insurance claim. Please click the link below to access the claim details and supporting documents:

${accessLink}

This link will expire on ${expirationDate}.

If you have any questions, please contact our billing department.

Thank you,
Marcher Hospital Management System
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
    }
    .header {
      background-color: #16a34a;
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .content {
      background-color: white;
      padding: 30px;
      border-radius: 0 0 8px 8px;
    }
    .claim-info {
      background-color: #f0f9ff;
      padding: 15px;
      border-left: 4px solid #3b82f6;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #16a34a;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: bold;
    }
    .button:hover {
      background-color: #15803d;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    .warning {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Insurance Claim Review Request</h1>
    </div>
    <div class="content">
      <p>Dear Insurance Reviewer,</p>
      
      <p>You have been requested to review an insurance claim for one of our patients. Please find the details below:</p>
      
      <div class="claim-info">
        <p><strong>Claim Number:</strong> ${claimNumber}</p>
        <p><strong>Patient Name:</strong> ${patientName}</p>
      </div>
      
      <p>To access the claim details and supporting documents, please click the button below:</p>
      
      <div style="text-align: center;">
        <a href="${accessLink}" class="button">Review Claim</a>
      </div>
      
      <p style="text-align: center; margin-top: 10px;">
        <small>Or copy and paste this link into your browser:<br>
        <a href="${accessLink}">${accessLink}</a></small>
      </p>
      
      <div class="warning">
        <p><strong>⚠️ Important:</strong></p>
        <p>This access link will expire on <strong>${expirationDate}</strong>.</p>
        <p>After reviewing the documents, you can approve or deny the claim directly through the portal.</p>
      </div>
      
      <p>If you have any questions or concerns, please contact our billing department.</p>
      
      <p>Thank you for your cooperation.</p>
      
      <div class="footer">
        <p><strong>Marcher Hospital Management System</strong></p>
        <p>This is an automated email. Please do not reply directly to this message.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim(),
  }

  await sendEmail(to, emailTemplate)
}
