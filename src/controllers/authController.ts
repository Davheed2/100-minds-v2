import { userRepository } from '@/repository';
import { Request, Response } from 'express';
import {
	AppError,
	AppResponse,
	comparePassword,
	createToken,
	generateAccessToken,
	generateOtp,
	generateRandomString,
	generateRefreshToken,
	getDomainReferer,
	hashPassword,
	parseTokenDuration,
	sendForgotPasswordEmail,
	sendLoginEmail,
	sendResetPasswordEmail,
	sendSignUpEmail,
	sendWelcomeEmail,
	setCookie,
	toJSON,
	verifyToken,
} from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { ENVIRONMENT } from '@/common/config';
import { DateTime } from 'luxon';
import { AccountType, Role } from '@/common/constants';

class AuthController {
	signUp = catchAsync(async (req: Request, res: Response) => {
		const { email, password, firstName, lastName, username, accountType } = req.body;

		if (!firstName || !lastName || !email || !username || !password) {
			throw new AppError('Incomplete signup data', 400);
		}
		if (!Object.values(AccountType).includes(accountType)) {
			throw new AppError('Invalid account type', 400);
		}

		const existingUser = await userRepository.findByEmailOrUsername(email, username);
		if (existingUser) {
			if (existingUser.email === email) {
				throw new AppError('User with this email already exists', 409);
			} else if (existingUser.username === username) {
				throw new AppError('User with this username already exists', 409);
			}
		}

		const hashedPassword = await hashPassword(password);
		const verificationToken = await generateRandomString();
		const hashedVerificationToken = createToken(
			{
				token: verificationToken,
			},
			{ expiresIn: '30d' }
		);

		const [user] = await userRepository.create({
			email,
			password: hashedPassword,
			firstName,
			lastName,
			username,
			ipAddress: req.ip,
			accountType,
			verificationToken,
			verificationTokenExpires: DateTime.now().plus({ days: 30 }).toJSDate(),
		});
		if (!user) {
			throw new AppError('Failed to create user', 500);
		}

		const verificationUrl = `${getDomainReferer(req)}/auth?verify=${hashedVerificationToken}`;
		await sendSignUpEmail(email, firstName, verificationUrl);

		return AppResponse(res, 201, toJSON([user]), `Verification link sent to ${email}`);
	});

	verifyAccount = catchAsync(async (req: Request, res: Response) => {
		const { verificationToken } = req.query;

		if (!verificationToken) {
			throw new AppError('Verification token is required', 400);
		}

		const decodedVerificationToken = await verifyToken(verificationToken as string);
		if (!decodedVerificationToken.token) {
			throw new AppError('Invalid verification token', 401);
		}

		const extinguishUser = await userRepository.findByVerificationToken(decodedVerificationToken.token);
		if (!extinguishUser) {
			throw new AppError('Invalid or expired verification token', 404);
		}
		if (extinguishUser.isEmailVerified) {
			throw new AppError('Account Already Verified', 400);
		}
		if (extinguishUser.tokenIsUsed) {
			throw new AppError('Verification token has already been used', 400);
		}
		if (extinguishUser.verificationTokenExpires < DateTime.now().toJSDate()) {
			throw new AppError('Verification token has expired', 400);
		}

		await userRepository.update(extinguishUser.id, {
			tokenIsUsed: true,
			isEmailVerified: true,
		});

		await sendWelcomeEmail(extinguishUser.email, extinguishUser.firstName);
		return AppResponse(res, 200, null, 'Email verified successfully');
	});

	signIn = catchAsync(async (req: Request, res: Response) => {
		const { email, password } = req.body;

		if (!email || !password) {
			throw new AppError('Incomplete login data', 401);
		}

		const user = await userRepository.findByEmail(email);
		if (!user) {
			throw new AppError('User not found', 404);
		}

		const currentRequestTime = DateTime.now();
		const lastLoginRetry = currentRequestTime.diff(DateTime.fromISO(user.lastLogin.toISOString()), 'hours');

		if (user.loginRetries >= 5 && Math.round(lastLoginRetry.hours) < 12) {
			throw new AppError('login retries exceeded!', 401);
		}

		const isPasswordValid = await comparePassword(password, user.password);
		if (!isPasswordValid) {
			await userRepository.update(user.id, { loginRetries: user.loginRetries + 1 });
			throw new AppError('Invalid credentials', 401);
		}

		if (!user.isEmailVerified) {
			throw new AppError('Your account is not yet verified', 401);
		}
		if (user.isSuspended) {
			throw new AppError('Your account is currently suspended', 401);
		}
		if (user.isDeleted) {
			throw new AppError('Your account is currently deleted', 401);
		}

		const accessToken = generateAccessToken(user.id);
		const refreshToken = generateRefreshToken(user.id);

		setCookie(req, res, 'accessToken', accessToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.ACCESS));
		setCookie(req, res, 'refreshToken', refreshToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.REFRESH));

		await userRepository.update(user.id, {
			loginRetries: 0,
			lastLogin: currentRequestTime.toJSDate(),
		});

		//login email
		const loginTime = DateTime.now().toFormat("cccc, LLLL d, yyyy 'at' t");
		await sendLoginEmail(user.email, user.firstName, loginTime);
		return AppResponse(res, 200, toJSON([user]), 'User logged in successfully');
	});

	adminSignIn = catchAsync(async (req: Request, res: Response) => {
		const { email, password } = req.body;

		if (!email || !password) {
			throw new AppError('Incomplete login data', 401);
		}

		const user = await userRepository.findByEmail(email);
		if (!user) {
			throw new AppError('User not found', 404);
		}
		if (user.role !== 'super_admin') {
			throw new AppError('Unauthorized access', 401);
		}

		const currentRequestTime = DateTime.now();
		const lastLoginRetry = currentRequestTime.diff(DateTime.fromISO(user.lastLogin.toISOString()), 'hours');

		if (user.loginRetries >= 5 && Math.round(lastLoginRetry.hours) < 12) {
			throw new AppError('login retries exceeded!', 401);
		}

		const isPasswordValid = await comparePassword(password, user.password);
		if (!isPasswordValid) {
			await userRepository.update(user.id, { loginRetries: user.loginRetries + 1 });
			throw new AppError('Invalid credentials', 401);
		}

		if (!user.isEmailVerified) {
			throw new AppError('Your account is not yet verified', 401);
		}
		if (user.isSuspended) {
			throw new AppError('Your account is currently suspended', 401);
		}
		if (user.isDeleted) {
			throw new AppError('Your account is currently deleted', 401);
		}

		const accessToken = generateAccessToken(user.id);
		const refreshToken = generateRefreshToken(user.id);

		setCookie(req, res, 'accessToken', accessToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.ACCESS));
		setCookie(req, res, 'refreshToken', refreshToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.REFRESH));

		await userRepository.update(user.id, {
			loginRetries: 0,
			lastLogin: currentRequestTime.toJSDate(),
		});

		//login email
		const loginTime = DateTime.now().toFormat("cccc, LLLL d, yyyy 'at' t");
		await sendLoginEmail(user.email, user.firstName, loginTime);
		return AppResponse(res, 200, toJSON([user]), 'User logged in successfully');
	});

	signOut = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('You are not logged in', 401);
		}

		//clearing the cookies set on the frontend by setting a new cookie with empty values and an expiry time in the past
		setCookie(req, res, 'accessToken', 'expired', -1);
		setCookie(req, res, 'refreshToken', 'expired', -1);

		AppResponse(res, 200, null, 'Logout successful');
	});

	forgotPassword = catchAsync(async (req: Request, res: Response) => {
		const { email } = req.body;

		if (!email) {
			throw new AppError('Email is required', 400);
		}

		const user = await userRepository.findByEmail(email);
		if (!user) {
			throw new AppError('No user found with provided email', 404);
		}

		if (user.passwordResetRetries >= 6) {
			await userRepository.update(user.id, {
				isSuspended: true,
			});

			throw new AppError('Password reset retries exceeded! and account suspended', 401);
		}

		const passwordResetToken = await generateRandomString();
		const hashedPasswordResetToken = createToken(
			{
				token: passwordResetToken,
			},
			{ expiresIn: '15m' }
		);

		const passwordResetUrl = `${getDomainReferer(req)}/reset-password?token=${hashedPasswordResetToken}`;

		await userRepository.update(user.id, {
			passwordResetToken: passwordResetToken,
			passwordResetExpires: DateTime.now().plus({ minutes: 15 }).toJSDate(),
			passwordResetRetries: user.passwordResetRetries + 1,
		});

		await sendForgotPasswordEmail(user.email, user.firstName, passwordResetUrl);

		return AppResponse(res, 200, null, `Password reset link sent to ${email}`);
	});

	resetPassword = catchAsync(async (req: Request, res: Response) => {
		const { token, password, confirmPassword } = req.body;

		if (!token || !password || !confirmPassword) {
			throw new AppError('All fields are required', 403);
		}
		if (password !== confirmPassword) {
			throw new AppError('Passwords do not match', 403);
		}

		const decodedToken = await verifyToken(token);
		if (!decodedToken.token) {
			throw new AppError('Invalid token', 401);
		}

		const user = await userRepository.findByPasswordResetToken(decodedToken.token);
		if (!user) {
			throw new AppError('Password reset token is invalid or has expired', 400);
		}

		const isSamePassword = await comparePassword(password, user.password);
		if (isSamePassword) {
			throw new AppError('New password cannot be the same as the old password', 400);
		}

		const hashedPassword = await hashPassword(password);

		const updatedUser = await userRepository.update(user.id, {
			password: hashedPassword,
			passwordResetRetries: 0,
			passwordChangedAt: DateTime.now().toJSDate(),
			passwordResetToken: '',
			passwordResetExpires: DateTime.now().toJSDate(),
		});
		if (!updatedUser) {
			throw new AppError('Password reset failed', 400);
		}

		await sendResetPasswordEmail(user.email, user.firstName);

		return AppResponse(res, 200, null, 'Password reset successfully');
	});

	appHealth = catchAsync(async (req: Request, res: Response) => {
		return AppResponse(res, 200, null, 'Server is healthy');
	});
}

export const authController = new AuthController();
