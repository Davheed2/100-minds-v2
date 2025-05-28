import { Request, Response } from 'express';
import {
	AppError,
	AppResponse,
	generatePresignedUrl,
	toJSON,
	uploadDocumentFile,
	uploadPictureFile,
} from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { courseContentRepository, courseRepository, moduleRepository } from '@/repository';
import { ICourse, ICourseContent } from '@/common/interfaces';
import { ENVIRONMENT } from '@/common/config';

export class CourseController {
	createCourse = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { title, description } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!title || !description) {
			throw new AppError('Title and description are required', 400);
		}
		if (user.role !== 'super_admin') {
			throw new AppError('Only super admins can create courses', 403);
		}

		const course = await courseRepository.create({
			title,
			description,
			userId: user.id,
		});
		if (!course) {
			throw new AppError('Failed to create course', 500);
		}

		return AppResponse(res, 201, toJSON(course), 'Course created successfully');
	});

	getAllCourses = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role !== 'super_admin') {
			throw new AppError('Only super admins can view all courses', 403);
		}

		let courses: ICourse[] = [];
		if (user.role === 'super_admin') {
			courses = await courseRepository.findAll();
			if (!courses || courses.length === 0) {
				return AppResponse(res, 200, [], 'No courses found');
			}
		} else if (user.role === 'client_admin') {
			courses = await courseRepository.findAll();
			if (!courses || courses.length === 0) {
				return AppResponse(res, 200, [], 'No courses found');
			}
		} else if (user.role === 'user') {
			courses = await courseRepository.findAllForClients();
			if (!courses || courses.length === 0) {
				return AppResponse(res, 200, [], 'No published course found');
			}
		}

		return AppResponse(res, 200, toJSON(courses), 'Courses retrieved successfully');
	});

	createModule = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { title, description, courseId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!title || !courseId) {
			throw new AppError('Title, and courseId are required', 400);
		}
		if (user.role !== 'super_admin') {
			throw new AppError('Only super admins can create modules', 403);
		}

		const module = await moduleRepository.create({
			title,
			description,
			courseId,
		});
		if (!module) {
			throw new AppError('Failed to create module', 500);
		}

		return AppResponse(res, 201, toJSON(module), 'Module created successfully');
	});

	getAllModulesByCourseId = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!courseId) {
			throw new AppError('CourseId is required', 400);
		}

		const modules = await moduleRepository.findAllByCourseId(courseId as string);
		if (!modules) {
			throw new AppError('No modules found for this course', 500);
		}

		return AppResponse(res, 200, toJSON(modules), 'Course Modules retrieved successfully');
	});

	createCourseContent = catchAsync(async (req: Request, res: Response) => {
		const { user, file } = req;
		const {
			courseId,
			moduleId,
			contentType,
			title,
			description,
			dueDate,
			maxScore,
			submissionType,
			fileName,
			fileType,
			fileSize,
			videoLength,
		} = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!courseId || !moduleId || !contentType) {
			throw new AppError('CourseId, moduleId and contentType are required', 400);
		}

		let courseContent: Partial<ICourseContent[]> | undefined;
		if (contentType === 'text') {
			const textContentExist = await courseContentRepository.findContent(moduleId, 'text');
			if (textContentExist.length > 1) {
				throw new AppError('Only one text file can exist under a module', 400);
			}
			if (!title) {
				throw new AppError('Title is required', 400);
			}

			courseContent = await courseContentRepository.create({
				courseId,
				moduleId,
				title,
				description,
				contentType,
			});

			if (!courseContent) {
				throw new AppError('Failed to create course text content', 500);
			}

			return AppResponse(res, 201, toJSON(courseContent), 'Course text content created successfully');
		}

		if (contentType === 'quiz') {
			if (!description) throw new AppError('quiz instruction is required', 400);
			if (!title) {
				throw new AppError('Title is required', 400);
			}

			courseContent = await courseContentRepository.create({
				courseId,
				moduleId,
				title,
				description,
				contentType,
			});

			if (!courseContent) {
				throw new AppError('Failed to create course quiz content', 500);
			}

			return AppResponse(res, 201, toJSON(courseContent), 'Course quiz content created successfully');
		}

		if (contentType === 'video') {
			if (!title || !description || !fileName || !fileType || !fileSize || !videoLength) {
				throw new AppError('title, description, fileName, fileType, fileSize and videoLength are required', 400);
			}

			const { signedUrl, key } = await generatePresignedUrl(fileName, fileType, fileSize);

			courseContent = await courseContentRepository.create({
				courseId,
				moduleId,
				title,
				description,
				videoUrl: `${ENVIRONMENT.R2.PUBLIC_URL}/${key}`,
				duration: videoLength,
				uploadStatus: 'uploading',
				contentType,
			});

			if (!courseContent) {
				throw new AppError('Failed to create course video content', 500);
			}

			return AppResponse(res, 201, { signedUrl, key }, 'Course video content created successfully');
		}

		if (contentType === 'file') {
			if (!file) {
				throw new AppError('File is required for file content type', 400);
			}
			if (!title) {
				throw new AppError('Title is required', 400);
			}

			const { secureUrl: fileUrl } = await uploadDocumentFile({
				fileName: `course-file/${Date.now()}-${file.originalname}`,
				buffer: file.buffer,
				mimetype: file.mimetype,
			});

			courseContent = await courseContentRepository.create({
				courseId,
				moduleId,
				title,
				description,
				fileUrl,
				contentType,
			});

			if (!courseContent) {
				throw new AppError('Failed to create course file content', 500);
			}

			return AppResponse(res, 201, toJSON(courseContent), 'Course file content created successfully');
		}

		if (contentType === 'assignment') {
			if (!maxScore) {
				throw new AppError('Max Score is required', 400);
			}
			if (!submissionType) {
				throw new AppError('submissionType is required', 400);
			}
			if (!description) {
				throw new AppError('Description is required', 400);
			}
			if (!title) {
				throw new AppError('Title is required', 400);
			}

			courseContent = await courseContentRepository.create({
				courseId,
				moduleId,
				title,
				description,
				dueDate,
				maxScore,
				submissionType,
				contentType,
			});

			if (!courseContent) {
				throw new AppError('Failed to create course assignment content', 500);
			}

			return AppResponse(res, 201, toJSON(courseContent), 'Course assignment content created successfully');
		}
	});
}

export const courseController = new CourseController();
