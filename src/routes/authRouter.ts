import { authController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

/**
 * @openapi
 * /auth/sign-up:
 *   post:
 *     summary: Register a new user
 *     description: Allows a new user to register by providing their email, password, first name, last name, username, and account type. The endpoint validates the input data, checks for existing email or username, generates a verification token, sends a verification email, and creates a user record with a pending verification status.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - username
 *               - accountType
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "uchennadavid2404@gmail.com"
 *                 description: The email address of the new user
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *                 description: The password for the new user
 *               firstName:
 *                 type: string
 *                 example: "Davheed"
 *                 description: The first name of the new user
 *               lastName:
 *                 type: string
 *                 example: "Daviddd"
 *                 description: The last name of the new user
 *               username:
 *                 type: string
 *                 example: "davheed"
 *                 description: The unique username for the new user
 *               accountType:
 *                 type: string
 *                 enum: [personal, business]
 *                 example: "personal"
 *                 description: The type of account for the new user
 *     responses:
 *       201:
 *         description: Verification link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "c76cfb91-2ef3-4e39-b08c-634b8d3e95f2"
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "uchennadavid2404@gmail.com"
 *                       username:
 *                         type: string
 *                         example: "davheed"
 *                       firstName:
 *                         type: string
 *                         example: "Davheed"
 *                       lastName:
 *                         type: string
 *                         example: "Daviddd"
 *                       photo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       role:
 *                         type: string
 *                         example: "user"
 *                       accountType:
 *                         type: string
 *                         example: "personal"
 *                       organizationLogo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       organizationName:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       organizationWebsite:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       organizationDescription:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       bio:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       careerGoals:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       opportunities:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       strengths:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       assessment:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       verificationToken:
 *                         type: string
 *                         example: "7566ba63a8d61032aecf4999253a90652f319c88481002f2f06b6ddebd28f4bf"
 *                       verificationTokenExpires:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-24T13:20:50.402Z"
 *                       tokenIsUsed:
 *                         type: boolean
 *                         example: false
 *                       isSuspended:
 *                         type: boolean
 *                         example: false
 *                       isEmailVerified:
 *                         type: boolean
 *                         example: false
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-25T13:20:50.487Z"
 *                 message:
 *                   type: string
 *                   example: "Verification link sent to uchennadavid2404@gmail.com"
 *       400:
 *         description: Bad Request - Incomplete signup data or invalid account type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Incomplete signup data"
 *       409:
 *         description: Conflict - User with this email or username already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "User with this email already exists"
 *       500:
 *         description: Internal Server Error - Failed to create user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Failed to create user"
 */
router.post('/sign-up', authController.signUp);
/**
 * @openapi
 * /auth/verify-account:
 *   get:
 *     summary: Verify a user account
 *     description: Verifies a user account using a verification token provided in the query string. The endpoint checks the token's validity, ensures the account is not already verified, confirms the token has not been used or expired, updates the user record to mark the email as verified, and sends a welcome email.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: verificationToken
 *         required: true
 *         schema:
 *           type: string
 *           example: "7566ba63a8d61032aecf4999253a90652f319c88481002f2f06b6ddebd28f4bf"
 *         description: The verification token sent to the user's email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Email verified successfully"
 *       400:
 *         description: Bad Request - Missing, already used, expired, or already verified token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Verification token is required"
 *       401:
 *         description: Unauthorized - Invalid verification token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Invalid verification token"
 *       404:
 *         description: Not Found - Invalid or expired verification token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired verification token"
 */
router.get('/verify-account', authController.verifyAccount);
/**
 * @openapi
 * /auth/sign-in:
 *   post:
 *     summary: Sign in a user
 *     description: Authenticates a user by validating their email and password. The endpoint checks for user existence, verifies the password, ensures the account is verified and not suspended or deleted, handles login retry limits, generates access and refresh tokens, sets them as cookies, and sends a login notification email.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "uchennadavid2404@gmail.com"
 *                 description: The email address of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *                 description: The password of the user
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "e81e635a-b144-4cb7-a702-a35f5d60e8d4"
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "uchennadavid2404@gmail.com"
 *                       username:
 *                         type: string
 *                         example: "davheed"
 *                       firstName:
 *                         type: string
 *                         example: "Davheed"
 *                       lastName:
 *                         type: string
 *                         example: "Daviddd"
 *                       photo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       role:
 *                         type: string
 *                         example: "user"
 *                       accountType:
 *                         type: string
 *                         example: "personal"
 *                       organizationLogo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       organizationName:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       organizationWebsite:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       organizationDescription:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       bio:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       careerGoals:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       opportunities:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       strengths:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       assessment:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       isSuspended:
 *                         type: boolean
 *                         example: false
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-25T13:31:43.474Z"
 *                 message:
 *                   type: string
 *                   example: "User logged in successfully"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly"
 *             description: Sets accessToken and refreshToken cookies
 *       401:
 *         description: Unauthorized - Incomplete login data, invalid credentials, unverified account, suspended account, deleted account, or login retries exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Incomplete login data"
 *       404:
 *         description: Not Found - User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */
router.post('/sign-in', authController.signIn);
/**
 * @openapi
 * /auth/admin/sign-in:
 *   post:
 *     summary: Sign in a super admin user
 *     description: Authenticates an admin user by validating their email and password. The endpoint checks for user existence, verifies the user has super_admin role, validates the password, ensures the account is verified and not suspended or deleted, handles login retry limits, generates access and refresh tokens, sets them as cookies, and sends a login notification email.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "uchennadavid2404@gmail.com"
 *                 description: The email address of the admin user
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *                 description: The password of the admin user
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "e81e635a-b144-4cb7-a702-a35f5d60e8d4"
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "uchennadavid2404@gmail.com"
 *                       username:
 *                         type: string
 *                         example: "davheed"
 *                       firstName:
 *                         type: string
 *                         example: "Davheed"
 *                       lastName:
 *                         type: string
 *                         example: "Daviddd"
 *                       photo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       role:
 *                         type: string
 *                         example: "super_admin"
 *                       accountType:
 *                         type: string
 *                         example: "personal"
 *                       organizationLogo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       organizationName:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       organizationWebsite:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       organizationDescription:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       bio:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       careerGoals:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       opportunities:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       strengths:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       assessment:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       isSuspended:
 *                         type: boolean
 *                         example: false
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-25T13:31:43.474Z"
 *                 message:
 *                   type: string
 *                   example: "User logged in successfully"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly"
 *             description: Sets accessToken and refreshToken cookies
 *       401:
 *         description: Unauthorized - Incomplete login data, invalid credentials, unverified account, suspended account, deleted account, login retries exceeded, or user is not a super_admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Incomplete login data"
 *       404:
 *         description: Not Found - User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */
router.post('/admin/sign-in', authController.adminSignIn);
/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     description: Initiates a password reset process by generating a reset token and sending a password reset email to the user. The endpoint validates the provided email, checks for user existence, ensures password reset retries are not exceeded, generates a reset token, updates the user record, and sends a reset link to the user's email.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "uchennadavid2404@gmail.com"
 *                 description: The email address of the user requesting a password reset
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Password reset link sent to uchennadavid2404@gmail.com"
 *       400:
 *         description: Bad Request - Email is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Email is required"
 *       401:
 *         description: Unauthorized - Password reset retries exceeded and account suspended
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Password reset retries exceeded! and account suspended"
 *       404:
 *         description: Not Found - No user found with provided email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "No user found with provided email"
 */
router.post('/forgot-password', authController.forgotPassword);
/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Reset a user password
 *     description: Resets a user's password using a reset token. The endpoint validates the provided token, password, and confirmPassword, ensures the passwords match and are not the same as the old password, updates the user record with the new hashed password, clears the reset token, and sends a confirmation email.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *               - confirmPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: "7566ba63a8d61032aecf4999253a90652f319c88481002f2f06b6ddebd28f4bf"
 *                 description: The password reset token sent to the user's email
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword123!"
 *                 description: The new password for the user
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword123!"
 *                 description: Confirmation of the new password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully"
 *       400:
 *         description: Bad Request - Missing fields, passwords do not match, new password same as old, or invalid/expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "All fields are required"
 *       401:
 *         description: Unauthorized - Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Invalid token"
 *       403:
 *         description: Forbidden - Missing fields or passwords do not match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "All fields are required"
 */
router.post('/reset-password', authController.resetPassword);
router.get('/health', authController.appHealth);

//protect all routes after this middleware
router.use(protect);

/**
 * @openapi
 * /auth/sign-out:
 *   post:
 *     summary: Sign out a user
 *     description: Logs out a user by clearing the access and refresh tokens from the client's cookies. The endpoint verifies that the user is logged in and sets the cookies to expire immediately.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=expired; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
 *             description: Clears accessToken and refreshToken cookies by setting them to expire
 *       401:
 *         description: Unauthorized - User is not logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "You are not logged in"
 */
router.post('/sign-out', authController.signOut);

export { router as authRouter };
