/**
 * App wide constants go here
 *
 * e.g
 * export const APP_NAME = 'MyApp';
 */
export enum Role {
	SUPERADMIN = 'super_admin',
	CLIENTADMIN = 'client_admin',
	USER = 'user',
}

export enum AccountType {
	PERSONAL = 'personal',
	ORGANIZATION = 'organization',
}

export enum CourseStatus {
	DRAFT = 'draft',
	PUBLISHED = 'published',
}

export enum VideoUploadStatus {
	PROCESSING = 'processing',
	COMPLETED = 'completed',
	FAILED = 'failed',
}

export enum ContentType {
	VIDEO = 'video',
	TEXT = 'text',
	QUIZ = 'quiz',
	ASSIGNMENT = 'assignment',
	FILE = 'file',
}

export enum SubmissionType {
	TEXT = 'text_submission',
	URL = 'url_submission',
	FILE = 'file_upload',
}
