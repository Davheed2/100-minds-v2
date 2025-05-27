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