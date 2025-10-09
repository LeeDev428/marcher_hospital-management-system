# Testing the Forgot Password Feature

## Quick Test Checklist

### 1. ✅ Start Development Server
```bash
npm run dev
```

### 2. ✅ Test Forgot Password Flow

#### Step 1: Request Password Reset
1. Navigate to: `http://localhost:3000/login`
2. Click: "Forgot your password?" link
3. Enter email: `patient@marcher.com` (or any valid user email)
4. Click: "Send reset link"
5. ✅ Should see: "Check your email" success message

#### Step 2: Check Server Logs
Look for these console logs:
```
🔐 Password reset requested for: patient@marcher.com
✅ Password reset email sent to: patient@marcher.com
🔗 Reset token: 1a2b3c4d... (expires at 2025-10-09T...)
```

#### Step 3: Get Reset Token
Option A - Check server logs for the reset token
Option B - Query database:
```sql
SELECT token, expiresAt, used 
FROM password_reset_tokens 
WHERE "userId" = (SELECT id FROM users WHERE email = 'patient@marcher.com')
ORDER BY "createdAt" DESC 
LIMIT 1;
```

#### Step 4: Test Reset Password Page
1. Navigate to: `http://localhost:3000/reset-password?token=YOUR_TOKEN_HERE`
2. ✅ Should see: Password reset form
3. Enter new password: `NewPassword123`
4. Confirm password: `NewPassword123`
5. Click: "Reset password"
6. ✅ Should see: "Password reset successful!" message
7. Click: "Go to login"

#### Step 5: Verify Password Changed
1. On login page
2. Enter email: `patient@marcher.com`
3. Enter NEW password: `NewPassword123`
4. Click: "Sign in"
5. ✅ Should successfully log in

---

## 🧪 Edge Case Tests

### Test 1: Invalid Email
- Enter non-existent email in forgot password
- ✅ Still shows success (security feature)
- ✅ No error message
- ✅ No email sent

### Test 2: Expired Token
```sql
-- Manually expire a token
UPDATE password_reset_tokens 
SET "expiresAt" = NOW() - INTERVAL '1 hour'
WHERE token = 'your_token';
```
- Try using expired token
- ✅ Should show: "This reset link has expired"
- ✅ Should offer: "Request new reset link" button

### Test 3: Reuse Token
- Complete password reset successfully
- Try using same token again
- ✅ Should show: "This reset link has already been used"

### Test 4: Invalid Token
- Navigate to: `/reset-password?token=invalid123`
- ✅ Should show: "Invalid or expired reset link"

### Test 5: Password Too Short
- Enter password with < 8 characters
- ✅ Submit button should be disabled
- ✅ Requirements checklist shows red X

### Test 6: Passwords Don't Match
- Enter different passwords in two fields
- ✅ Submit button should be disabled
- ✅ Requirements checklist shows mismatch

---

## 📧 Email Testing

### Check Email Content:
1. **Subject:** "Reset Your Password - Marcher Healthcare"
2. **From:** "Marcher Healthcare <marcher.csb@gmail.com>"
3. **Contains:**
   - Marcher logo/branding
   - User's email address
   - "Reset My Password" button
   - Plain text link (for email clients without HTML)
   - Security warning
   - 1-hour expiration notice
   - Support contact

### Test Email Clients:
- Gmail (web)
- Outlook (web)
- Mobile email app
- ✅ HTML renders correctly
- ✅ Button is clickable
- ✅ Link works when clicked

---

## 🐛 Common Issues & Solutions

### Issue: Email not sending
**Check:**
```bash
# In server console, look for:
❌ Error sending password reset email: [error details]
```

**Solutions:**
1. Verify SMTP credentials in `util/email/index.ts`
2. Check Gmail settings (App Password might be needed)
3. Test with curl:
```bash
curl -v smtp://smtp.gmail.com:587 --user "marcher.csb@gmail.com:xlbc tpvc vdxf simc"
```

### Issue: Token not found
**Check database:**
```sql
SELECT * FROM password_reset_tokens ORDER BY "createdAt" DESC LIMIT 5;
```

**Verify:**
- Token exists
- `used = false`
- `expiresAt > NOW()`

### Issue: Password not updating
**Check:**
```sql
-- Before reset
SELECT email, password FROM users WHERE email = 'patient@marcher.com';

-- After reset (password hash should change)
SELECT email, password FROM users WHERE email = 'patient@marcher.com';
```

### Issue: TypeScript errors
**Run:**
```bash
npx prisma generate --schema=prisma/instance/schema.prisma
npm run dev
```

---

## 📊 Database Queries for Testing

### Check all reset tokens
```sql
SELECT 
  prt.token,
  prt."expiresAt",
  prt.used,
  prt."createdAt",
  u.email
FROM password_reset_tokens prt
JOIN users u ON u.id = prt."userId"
ORDER BY prt."createdAt" DESC;
```

### Clean up old tokens
```sql
DELETE FROM password_reset_tokens 
WHERE "expiresAt" < NOW() OR used = true;
```

### Manually create test token (for debugging)
```sql
INSERT INTO password_reset_tokens ("id", "userId", token, "expiresAt", used, "createdAt")
VALUES (
  'test_token_123',
  (SELECT id FROM users WHERE email = 'patient@marcher.com'),
  'test123token456',
  NOW() + INTERVAL '1 hour',
  false,
  NOW()
);
```

---

## ✅ Success Criteria

All tests pass if:
- ✅ Forgot password link works
- ✅ Email form validates input
- ✅ Success message appears
- ✅ Email is sent (or logged in console)
- ✅ Reset link opens reset page
- ✅ Token is validated on page load
- ✅ Password form validates input
- ✅ Password requirements are checked
- ✅ Password is updated in database
- ✅ User can login with new password
- ✅ Token is marked as used
- ✅ Expired tokens are rejected
- ✅ Used tokens are rejected
- ✅ Invalid tokens are rejected

---

## 🎯 Next Steps After Testing

1. **Test with real Gmail account** - Verify emails actually send
2. **Test on mobile devices** - Check responsive design
3. **Add rate limiting** - Prevent abuse (future enhancement)
4. **Add logging** - Track password reset attempts
5. **Monitor email delivery** - Set up email delivery monitoring

---

## 📝 Test Report Template

```markdown
# Password Reset Test Report

**Date:** [Date]
**Tester:** [Name]
**Environment:** [Dev/Staging/Production]

## Test Results

| Test Case | Status | Notes |
|-----------|--------|-------|
| Forgot password link | ✅/❌ | |
| Email validation | ✅/❌ | |
| Token generation | ✅/❌ | |
| Email delivery | ✅/❌ | |
| Reset page loads | ✅/❌ | |
| Token validation | ✅/❌ | |
| Password update | ✅/❌ | |
| Login with new password | ✅/❌ | |
| Expired token handling | ✅/❌ | |
| Used token handling | ✅/❌ | |

## Issues Found
1. [Issue description]
2. [Issue description]

## Recommendations
1. [Recommendation]
2. [Recommendation]
```

---

**Happy Testing! 🎉**
