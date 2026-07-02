# ✅ Walkthrough — Google Sign-In, Password Policy, Forgot Password & Home Page Image

We have successfully implemented:
- Google Sign-In (exclusively replacing previous social buttons on Login/Register).
- 8-Character Password Strength Policy requiring at least 1 special symbol.
- Forgot Password verification flow using a 6-digit Email OTP.
- Custom scenic hero visual replacement for the home page.

---

## What Was Done

### 1. Home Page Visual Replacement
- Replaced the hero visual asset `boarding_house_3d_hero.png` under [static/images/](file:///D:/Desktop/Data%20Science%20-%20SUSL/Semester%202/DS2105%20Capstone%20Project%20in%20Data%20Science%20I/Boarding%20places/frontend/static/images/) with the uploaded scenic photo of the Sabaragamuwa University of Sri Lanka campus, rendering it with custom border-radius, floating animation, and glowing drop-shadow.

### 2. User Database Model Update
- Added new columns `google_id` (nullable), `otp_code` (nullable), and `otp_expiry` (nullable) to the `users` table.
- Made the `password` column nullable to support password-less Google accounts.
- Automated schema updates inside the application creation lifecycle using `ensure_columns_exist(db)` in `helper.py`.

### 3. Password Strength Enforcement
- Enforced a password policy of **minimum 8 characters** and **at least 1 special symbol** (`!@#$%^&*()_+-=[]{}|;':",./<>?`~`).
- Added HTML5 browser-level constraints (`pattern` and `minlength`) and a detailed helper legend text to the password inputs in [auth.html](file:///D:/Desktop/Data%20Science%20-%20SUSL/Semester%202/DS2105%20Capstone%20Project%20in%20Data%20Science%20I/Boarding%20places/frontend/templates/auth.html).
- Implemented robust regex-based back-end validation on the server side during account registration and password resets.

### 4. Single-Option "Sign in with Google" Button
- Cleaned up the "Or continue with" section in [auth.html](file:///D:/Desktop/Data%20Science%20-%20SUSL/Semester%202/DS2105%20Capstone%20Project%20in%20Data%20Science%20I/Boarding%20places/frontend/templates/auth.html) by removing the GitHub button.
- Designed a beautiful full-width Google button displaying the Google branding, matching the overall premium card layout.

### 5. Google Sign-In & Callback Backend
- Built the `/auth/google` route which redirects users to Google's OAuth 2.0 endpoint using standard Python URL encoding.
- Built the `/auth/google/callback` handler which requests tokens, fetches user information, automatically links existing emails, creates new user objects, and logs the user in.
- Included an automatic **Demo Mode** fallback: if Google Client ID or Secret are missing from `.env`, clicking the Google button automatically signs the tester in with a mock Google user account (`google_demo@unistay.com`) so it can be evaluated instantly without configuring credentials.

### 6. Forgot Password OTP Email Verification
- Linked the login card's "Forgot password?" link to the new forgot password workflow.
- Created `forgot_password.html` to request code verification via email.
- Created `verify_otp.html` to enter the 6-digit OTP code (with helper expiration tracking).
- Created `reset_password.html` to enter and confirm the new password under strength validation.
- Configured a robust email sender function using Python's built-in `smtplib` and MIME tools in [helper.py](file:///D:/Desktop/Data%20Science%20-%20SUSL/Semester%202/DS2105%20Capstone%20Project%20in%20Data%20Science%20I/Boarding%20places/backend/app/utils/helper.py) that works with any SMTP configurations set in `.env` (falls back to logging codes in console and displaying codes in warning notifications if SMTP keys are not configured).

---

## Verification Steps

### 1. Home Page Visual
- Open `http://127.0.0.1:5000/` and verify that the campus view image is displayed on the right of the hero section.

### 2. Password Strength Policy
- Try creating an account at `http://127.0.0.1:5000/register` with a short password (`123`) or a password without symbols (`password123`). The form will block submission with a helper tooltip.
- Try sending a POST request to register directly; verify that the server returns a flash warning: "Password must contain at least one special character."

### 3. Google Sign-In
- Go to `http://127.0.0.1:5000/login`. Under "Or continue with", verify that only the Google button is shown.
- Click "Continue with Google". Since Google OAuth keys are not set, it will log you in using **Demo Mode** with the username `Google Demo User` and display a mock login success notice.
- Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env` to execute actual authorization.

### 4. Forgot Password Flow
- On the login page, click "Forgot password?".
- Enter your email address (e.g. `admin@test.com` or your own user email).
- If SMTP credentials are not configured, verify the flash notification displays the OTP code in Demo Mode.
- Enter the code on the verification page.
- Choose a new password (e.g. `NewPass123!`). Confirm it and click reset.
- Log in using your email and new password to confirm the password reset was successful.
