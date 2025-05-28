import { knexDb } from '@/common/config';
import { ICourseContent } from '@/common/interfaces';
import { DateTime } from 'luxon';

class CourseContentRepository {
	create = async (payload: Partial<ICourseContent>) => {
		return await knexDb.table('course_content').insert(payload).returning('*');
	};

	findById = async (id: string): Promise<ICourseContent | null> => {
		return await knexDb.table('course_content').where({ id }).first();
	};

	update = async (id: string, payload: Partial<ICourseContent>): Promise<ICourseContent[]> => {
		return await knexDb('course_content')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	findAll = async () => {
		return await knexDb.table('course_content').orderBy('created_at', 'desc');
	};

	findContent = async (moduleId: string, type: string) => {
		return await knexDb.table('course_content').where({ moduleId, contentType: type }).orderBy('created_at', 'desc');
	};

	findCourseContent = async (courseId: string, moduleId: string, type: string) => {
		return await knexDb
			.table('course_content')
			.where({ courseId, moduleId, contentType: type })
			.orderBy('created_at', 'desc');
	};
}

export const courseContentRepository = new CourseContentRepository();
