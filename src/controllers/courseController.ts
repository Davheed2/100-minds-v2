import { Request, Response } from 'express';
import { AppError, AppResponse, toJSON, uploadPictureFile } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { courseRepository, moduleRepository } from '@/repository';
import { ICourse } from '@/common/interfaces';

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
}

export const courseController = new CourseController();
