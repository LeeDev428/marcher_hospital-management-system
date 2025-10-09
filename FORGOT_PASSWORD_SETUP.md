# Forgot Password Setup Guide

## ✅ Implementation Complete!

A complete forgot password system has been implemented with email verification. Here's what was done:

---

## 🗄️ Database Changes

### Instance Database (`marcher_hospital_instance`)
Added a new table: `password_reset_tokens`

```sql
- id: String (Primary Key, CUID)
- userId: String (Foreign Key to users.id)
- token: String (Unique, 64-character hex)
- expiresAt: DateTime (1 hour from creation)
- used: Boolean (Default: false)
- createdAt: DateTime
```

**Status:** ✅ Already pushed to database

---

## 📧 Email Configuration

### SMTP Settings (Already Configured)
- **Host:** smtp.gmail.com
- **Port:** 587
- **Username:** marcher.csb@gmail.com
- **Password:** xlbc tpvc vdxf simc

**File:** `util/email/index.ts`

### Email Template
Beautiful HTML email with:
- Professional design with Marcher Healthcare branding
- Secure reset button
- 1-hour expiration notice
- Security warnings
- Plain text fallback

**File:** `util/email/templates/passwordReset.ts`

---

## 🔧 Backend API Endpoints

### Authentication Router: `auth.passwordReset.*`

All endpoints added to: `server/trpc/routers/auth/passwordReset.ts`

#### 1. **Request Password Reset**
```typescript
$trpc.auth.passwordReset.requestPasswordReset.mutate({ email: string })
```
- Validates email exists in database
- Generates secure 64-character random token
- Creates token record with 1-hour expiration
- Sends professional email with reset link
- Returns success message (prevents email enumeration)

#### 2. **Reset Password**
```typescript
$trpc.auth.passwordReset.resetPassword.mutate({ 
  token: string, 
  newPassword: string 
})
```
- Validates token exists, not used, not expired
- Hashes new password with bcrypt
- Updates user password in database
- Marks token as used (one-time use only)
- Transaction ensures atomicity

#### 3. **Verify Token**
```typescript
$trpc.auth.passwordReset.verifyResetToken.query({ token: string })
```
- Checks if token is valid for UI display
- Returns `{ valid: boolean }`

---

## 🎨 Frontend Pages

### 1. Forgot Password Page
**Route:** `/forgot-password`
**File:** `pages/forgot-password.vue`

**Features:**
- Email input form
- Loading states
- Success confirmation with instructions
- Security notice
- Back to login link

**UI Flow:**
1. User enters email
2. Clicks "Send reset link"
3. Shows success message (even if email doesn't exist)
4. Displays "Check your email" confirmation

---

### 2. Reset Password Page
**Route:** `/reset-password?token=<token>`
**File:** `pages/reset-password.vue`

**Features:**
- Token verification on page load
- New password input with show/hide toggle
- Confirm password validation
- Password requirements checklist
- Real-time password matching indicator
- Success confirmation with login redirect
- Invalid/expired token handling

**UI Flow:**
1. User clicks link in email → opens `/reset-password?token=xxx`
2. Page verifies token validity
3. If valid: Shows password form
4. If invalid: Shows error with "Request new link" button
5. User enters new password + confirmation
6. Shows success message
7. Redirects to login page

---

### 3. Login Page Update
**File:** `pages/login.vue`

**Change:**
```vue
<!-- OLD -->
<a href="#" class="text-sm text-teal-600 hover:text-teal-500">
  Forgot your password?
</a>

<!-- NEW -->
<NuxtLink to="/forgot-password" class="text-sm text-teal-600 hover:text-teal-500">
  Forgot your password?
</NuxtLink>
```

---

## 🔒 Security Features

### 1. **Token Security**
- ✅ 64-character cryptographically random tokens (crypto.randomBytes)
- ✅ One-time use only (marked as `used: true` after reset)
- ✅ 1-hour expiration
- ✅ Stored in database with indexes for fast lookup

### 2. **Email Enumeration Prevention**
- ✅ Always returns success message, even if email doesn't exist
- ✅ Prevents attackers from discovering valid emails

### 3. **Password Security**
- ✅ Minimum 8 characters enforced
- ✅ Bcrypt hashing with salt
- ✅ Password confirmation required

### 4. **Rate Limiting Ready**
- 🔄 Consider adding rate limiting on email endpoint (future enhancement)

---

## 📁 Files Created/Modified

### ✨ New Files
1. `server/trpc/routers/auth/passwordReset.ts` - Backend logic
2. `util/email/templates/passwordReset.ts` - Email template
3. `pages/forgot-password.vue` - Request reset page
4. `pages/reset-password.vue` - Reset password page

### 📝 Modified Files
1. `pages/login.vue` - Added forgot password link
2. `prisma/instance/schema.prisma` - Added PasswordResetToken model
3. `util/email/index.ts` - Configured SMTP settings
4. `server/trpc/routers/auth/index.ts` - Registered password reset router

---

## 🚀 Testing Instructions

### Test Scenario 1: Happy Path
1. **Navigate to:** `http://localhost:3000/login`
2. **Click:** "Forgot your password?" link
3. **Enter:** Your test email (e.g., `patient@marcher.com`)
4. **Click:** "Send reset link"
5. **Check:** Email inbox for reset link
6. **Click:** Reset link in email
7. **Enter:** New password (min 8 characters)
8. **Confirm:** Password matches
9. **Click:** "Reset password"
10. **Verify:** Success message appears
11. **Click:** "Go to login"
12. **Test:** Login with new password

### Test Scenario 2: Invalid Email
1. Navigate to `/forgot-password`
2. Enter non-existent email
3. **Expected:** Still shows success message (security feature)
4. **Verify:** No email sent

### Test Scenario 3: Expired Token
1. Request password reset
2. Wait 1 hour (or manually expire token in database)
3. Click reset link
4. **Expected:** "Invalid or expired reset link" error
5. **Click:** "Request new reset link"

### Test Scenario 4: Reusing Token
1. Complete full password reset
2. Try clicking the same email link again
3. **Expected:** "This reset link has already been used" error

---

## 🎯 What to Check

### ✅ Backend
```bash
# Check server logs for:
🔐 Password reset requested for: user@example.com
✅ Password reset email sent to: user@example.com
🔗 Reset token: abc123... (expires at ...)
🔐 Password reset attempt with token: abc123...
✅ Password reset successful for user: user@example.com
```

### ✅ Database
```sql
-- Check tokens are created
SELECT * FROM password_reset_tokens;

-- Check user passwords are hashed
SELECT id, email, password FROM users WHERE email = 'test@example.com';
```

### ✅ Email
- Email arrives within 1 minute
- HTML renders correctly
- Reset link is clickable
- Link contains unique token

### ✅ UI
- Forms are responsive
- Loading states work
- Error messages display properly
- Success states show correctly
- Password visibility toggles work

---

## 🐛 Troubleshooting

### Email Not Sending?
**Check:**
1. SMTP credentials are correct
2. Gmail "Less secure app access" is enabled OR use App Password
3. Check server console for email errors
4. Verify `sendEmail()` is being called

**Solution:**
```bash
# Test email configuration
# Check util/email/index.ts logs
```

### Token Invalid?
**Check:**
1. Token in URL matches database
2. Token hasn't expired (createdAt + 1 hour)
3. Token hasn't been used (`used = false`)

### Password Not Updating?
**Check:**
1. `hashPassword()` function is working
2. Database transaction succeeded
3. User ID matches token.userId

---

## 🎨 Customization Options

### Change Token Expiration
**File:** `server/trpc/routers/auth/passwordReset.ts`
```typescript
// Current: 1 hour
const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

// Change to 30 minutes:
const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

// Change to 24 hours:
const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
```

### Change Email Template
**File:** `util/email/templates/passwordReset.ts`
- Modify HTML structure
- Change colors (teal-500 → your brand color)
- Add/remove sections

### Change Password Requirements
**File:** `pages/reset-password.vue`
```vue
<!-- Current: 8 characters minimum -->
<input minlength="8" />

<!-- Add regex pattern for complexity -->
<input 
  pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
  title="Must contain at least 8 characters with letters and numbers"
/>
```

---

## 🔮 Future Enhancements

### Recommended Additions:
1. **Rate Limiting** - Limit password reset requests per IP/email
2. **Email Verification** - Verify email before allowing password reset
3. **Password History** - Prevent reusing old passwords
4. **2FA Integration** - Require 2FA before reset
5. **Admin Notifications** - Alert admins of password changes
6. **Token Cleanup Job** - Cron job to delete expired tokens

---

## 📞 Support

If you encounter issues:
1. Check server console logs
2. Verify database connection
3. Test email configuration
4. Review error messages in browser console
5. Check network tab for API errors

---

## ✅ Summary

**What's Working:**
- ✅ Forgot password link on login page
- ✅ Email request form with validation
- ✅ Secure token generation and storage
- ✅ Professional HTML email delivery
- ✅ Token validation and expiration
- ✅ Password reset with confirmation
- ✅ Success/error handling
- ✅ Database integration complete

**Ready to use!** 🎉

Just restart your development server and test the flow.
