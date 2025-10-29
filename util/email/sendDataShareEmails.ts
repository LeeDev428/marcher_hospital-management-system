import { sendEmail } from './index'

interface SendDataShareRequestEmailParams {
  to: string
  requestNumber: string
  patientName: string
  hospitalName: string
  reason: string
}

export async function sendDataShareRequestEmail({
  to,
  requestNumber,
  patientName,
  hospitalName,
  reason,
}: SendDataShareRequestEmailParams) {
  const emailTemplate = {
    from: process.env.SMTP_USERNAME || 'marcher.csb@gmail.com',
    subject: `Data Share Request Created - ${requestNumber}`,
    text: `
Data Share Request Created

Request Number: ${requestNumber}
Patient Name: ${patientName}
Requesting Hospital: ${hospitalName}

A data share request has been created and is pending internal review.

Reason: ${reason}

You will receive another email once the request has been reviewed.

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
      background-color: #10b981;
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
    .request-info {
      background-color: #f0fdf4;
      padding: 15px;
      border-left: 4px solid #10b981;
      margin: 20px 0;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Data Share Request Created</h1>
    </div>
    <div class="content">
      <p>Dear ${hospitalName},</p>
      <p>Your data share request has been successfully created and submitted for internal review.</p>
      
      <div class="request-info">
        <p><strong>Request Number:</strong> ${requestNumber}</p>
        <p><strong>Patient Name:</strong> ${patientName}</p>
        <p><strong>Status:</strong> Pending Review</p>
      </div>

      <p><strong>Reason for Request:</strong></p>
      <p>${reason}</p>

      <p>Our staff will review this request and you will receive an email notification once a decision has been made.</p>

      <div class="footer">
        <p>This is an automated email from Marcher Hospital Management System.</p>
        <p>If you have any questions, please contact our medical records department.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim(),
  }

  await sendEmail(to, emailTemplate)
}

interface SendDataShareApprovedEmailParams {
  to: string
  requestNumber: string
  patientName: string
  accessLink: string
  expiresAt: Date
}

export async function sendDataShareApprovedEmail({
  to,
  requestNumber,
  patientName,
  accessLink,
  expiresAt,
}: SendDataShareApprovedEmailParams) {
  const expirationDate = expiresAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const emailTemplate = {
    from: process.env.SMTP_USERNAME || 'marcher.csb@gmail.com',
    subject: `Data Share Request Approved - ${requestNumber}`,
    text: `
Data Share Request Approved

Request Number: ${requestNumber}
Patient Name: ${patientName}

Your data share request has been approved! You can now access the patient's encounter data using the secure link below:

${accessLink}

This link will expire on ${expirationDate}.

Important: This link is single-use and confidential. Do not share it with unauthorized personnel.

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
      background-color: #10b981;
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
    .request-info {
      background-color: #f0fdf4;
      padding: 15px;
      border-left: 4px solid #10b981;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #10b981;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: bold;
    }
    .button:hover {
      background-color: #059669;
    }
    .warning {
      background-color: #fef3c7;
      padding: 15px;
      border-left: 4px solid #f59e0b;
      margin: 20px 0;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Request Approved</h1>
    </div>
    <div class="content">
      <p>Good news! Your data share request has been approved.</p>
      
      <div class="request-info">
        <p><strong>Request Number:</strong> ${requestNumber}</p>
        <p><strong>Patient Name:</strong> ${patientName}</p>
        <p><strong>Status:</strong> Approved</p>
      </div>

      <p>Click the button below to access the patient's encounter data:</p>

      <div style="text-align: center;">
        <a href="${accessLink}" class="button">Access Patient Data</a>
      </div>

      <div class="warning">
        <p><strong>⚠️ Important Security Information:</strong></p>
        <ul>
          <li>This link expires on <strong>${expirationDate}</strong></li>
          <li>The link is single-use and confidential</li>
          <li>Do not share this link with unauthorized personnel</li>
          <li>Access will be logged for security purposes</li>
        </ul>
      </div>

      <div class="footer">
        <p>This is an automated email from Marcher Hospital Management System.</p>
        <p>If you did not request this data, please contact us immediately.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim(),
  }

  await sendEmail(to, emailTemplate)
}

interface SendDataShareDeniedEmailParams {
  to: string
  requestNumber: string
  patientName: string
  denialReason: string
}

export async function sendDataShareDeniedEmail({
  to,
  requestNumber,
  patientName,
  denialReason,
}: SendDataShareDeniedEmailParams) {
  const emailTemplate = {
    from: process.env.SMTP_USERNAME || 'marcher.csb@gmail.com',
    subject: `Data Share Request Denied - ${requestNumber}`,
    text: `
Data Share Request Denied

Request Number: ${requestNumber}
Patient Name: ${patientName}

Unfortunately, your data share request has been denied.

Reason for Denial:
${denialReason}

If you believe this decision was made in error or have additional information to provide, please contact our medical records department.

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
      background-color: #ef4444;
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
    .request-info {
      background-color: #fef2f2;
      padding: 15px;
      border-left: 4px solid #ef4444;
      margin: 20px 0;
    }
    .denial-reason {
      background-color: #f9fafb;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Request Denied</h1>
    </div>
    <div class="content">
      <p>We regret to inform you that your data share request has been denied.</p>
      
      <div class="request-info">
        <p><strong>Request Number:</strong> ${requestNumber}</p>
        <p><strong>Patient Name:</strong> ${patientName}</p>
        <p><strong>Status:</strong> Denied</p>
      </div>

      <div class="denial-reason">
        <p><strong>Reason for Denial:</strong></p>
        <p>${denialReason}</p>
      </div>

      <p>If you believe this decision was made in error or if you have additional information to provide, please contact our medical records department.</p>

      <div class="footer">
        <p>This is an automated email from Marcher Hospital Management System.</p>
        <p>For inquiries, please contact: records@marcherhospital.com</p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim(),
  }

  await sendEmail(to, emailTemplate)
}

interface SendPatientDataShareNotificationParams {
  to: string
  patientName: string
  hospitalName: string
  requestNumber: string
}

export async function sendPatientDataShareNotification({
  to,
  patientName,
  hospitalName,
  requestNumber,
}: SendPatientDataShareNotificationParams) {
  const emailTemplate = {
    from: process.env.SMTP_USERNAME || 'marcher.csb@gmail.com',
    subject: 'Your Medical Data Has Been Shared',
    text: `
Medical Data Share Notification

Dear ${patientName},

This is to inform you that your medical data has been shared with ${hospitalName} as per their approved request.

Request Number: ${requestNumber}

This data sharing was approved by our medical staff and is in compliance with patient privacy regulations. Only relevant medical information has been shared.

If you have any concerns or questions about this data share, please contact our medical records department.

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
      background-color: #3b82f6;
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
    .info-box {
      background-color: #eff6ff;
      padding: 15px;
      border-left: 4px solid #3b82f6;
      margin: 20px 0;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Medical Data Share Notification</h1>
    </div>
    <div class="content">
      <p>Dear ${patientName},</p>
      <p>This is to inform you that your medical data has been shared with an external healthcare provider.</p>
      
      <div class="info-box">
        <p><strong>Shared With:</strong> ${hospitalName}</p>
        <p><strong>Request Number:</strong> ${requestNumber}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <p>This data sharing was approved by our medical staff and is in compliance with patient privacy regulations. Only relevant medical information related to your treatment has been shared.</p>

      <p>If you have any concerns or questions about this data share, please contact our medical records department immediately.</p>

      <div class="footer">
        <p>This is an automated email from Marcher Hospital Management System.</p>
        <p>Your privacy and data security are our top priorities.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim(),
  }

  await sendEmail(to, emailTemplate)
}
