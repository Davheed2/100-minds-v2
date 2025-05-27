import { Request, Response } from 'express';
import { AppError, AppResponse, toJSON, uploadPictureFile } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { courseRepository } from '@/repository';

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
}

export const courseController = new CourseController();
