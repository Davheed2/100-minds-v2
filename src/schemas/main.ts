import { AccountType, Role } from '@/common/constants';
import { dateFromString } from '@/common/utils';
import { de } from '@faker-js/faker/.';
import { z } from 'zod';

const passwordRegexMessage =
	'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character or symbol';

const quizOptionEnum = z.enum(['optionA', 'optionB', 'optionC', 'optionD', 'optionE']);

export const mainSchema = z.object({
	firstName: z
		.string()
		.min(2, 'First name must be at least 2 characters long')
		.max(50, 'First name must not be 50 characters long')
		.refine((name) => /^(?!.*-[a-z])[A-Z][a-z'-]*(?:-[A-Z][a-z'-]*)*(?:'[A-Z][a-z'-]*)*$/g.test(name), {
			message:
				'First name must be in sentence case, can include hyphen, and apostrophes (e.g., "Ali", "Ade-Bright" or "Smith\'s").',
		}),
	lastName: z
		.string()
		.min(2, 'Last name must be at least 2 characters long')
		.max(50, 'Last name must not be 50 characters long')
		.refine((name) => /^(?!.*-[a-z])[A-Z][a-z'-]*(?:-[A-Z][a-z'-]*)*(?:'[A-Z][a-z'-]*)*$/g.test(name), {
			message:
				'Last name must be in sentence case, can include hyphen, and apostrophes (e.g., "Ali", "Ade-Bright" or "Smith\'s").',
		}),
	username: z.string().min(3).trim().toLowerCase(),
	email: z.string().email('Please enter a valid email address!').toLowerCase(),
	password: z
		.string()
		.min(8, 'Password must have at least 8 characters!')
		.regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).*$/, {
			message: passwordRegexMessage,
		}),
	confirmPassword: z
		.string()
		.min(8, 'Confirm Password must have at least 8 characters!')
		.regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).*$/, {
			message: passwordRegexMessage,
		}),
	otp: z.string().min(6, 'OTP must be at least 6 characters long'),
	otpExpires: z.string().transform(dateFromString),
	token: z.string(),
	receiveCodeViaEmail: z.boolean(),
	name: z.string().min(3).trim(),
	title: z.string().min(3).trim(),
	teamId: z.string().uuid(),
	courseId: z.string().uuid(),
	description: z.string().min(3),
	memberId: z.string().uuid(),
	chapterId: z.string().uuid(),
	favouriteId: z.string().uuid(),
	videoId: z.string().uuid(),
	inviteLink: z.string().min(7),
	inviteLinkExpires: z.string().transform(dateFromString),
	scenario: z.string().min(3).trim(),
	scenarioId: z.string().uuid(),
	moduleId: z.string().uuid(),
	isDone: z.boolean(),
	timeSpent: z.string().min(1),
	role: z.enum([Role.SUPERADMIN, Role.CLIENTADMIN, Role.USER]),
	accountType: z.enum(Object.values(AccountType) as [string, ...string[]]),
	organizationLogo: z.string().min(7),
	organizationName: z.string().min(3).trim(),
	organizationWebsite: z.string().min(7),
	organizationDescription: z.string().min(7),
	category: z.string().min(7).toLowerCase(),
	bio: z.string().min(7),
	careerGoals: z.string().min(7),
	opportunities: z.string().min(7),
	strengths: z.string().min(7),
	assessment: z.string().min(7),
	rolePlayId: z.string().uuid(),
	score: z.number().positive(),
	quizId: z.string().uuid(),
	assessmentId: z.string().uuid(),
	quizScoreId: z.string().uuid(),
	fileName: z.string(),
	fileType: z.string(),
	fileSize: z.number(),
	videoLength: z.string(),
	key: z.string(),
	skill: z.string(),
	skills: z.string(),
	skillId: z.string().uuid(),
	videoUploadStatus: z.string(),
	amount: z.number().positive(),
	question: z.string().trim(),
	optionA: z.string().trim(),
	optionB: z.string().trim(),
	optionC: z.string().trim(),
	optionD: z.string().trim(),
	optionE: z.string().trim(),
	isCorrect: z.array(quizOptionEnum).min(1, 'At least one correct option is required'),
	answers: z
		.array(
			z.object({
				quizId: z.string().uuid(),
				selectedOption: quizOptionEnum,
			})
		)
		.min(1, 'At least one answer is required'),
	assessmentAnswers: z
		.array(
			z.object({
				assessmentId: z.string().uuid(),
				selectedOption: quizOptionEnum,
			})
		)
		.min(1, 'At least one answer is required'),
	duration: z.string(),
	lastWatched: z.string(),
	suspend: z.boolean(),
	makeAdmin: z.boolean(),
	showLogo: z.string(),
	isChapterCompleted: z.boolean(),
	userId: z.string().uuid(),
	// hideMyDetails: z.boolean().default(false),
	message: z.string().min(10),
	oldPassword: z.string().min(8),
	newPassword: z
		.string()
		.min(8, 'Password must have at least 8 characters!')
		.regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).*$/, {
			message: passwordRegexMessage,
		}),
	// redirectUrl: z.string().url(),
});

// Define the partial for partial validation
export const partialMainSchema = mainSchema.partial();
