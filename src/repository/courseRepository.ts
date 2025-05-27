import { knexDb } from '@/common/config';
import { ICourse } from '@/common/interfaces';
import { DateTime } from 'luxon';

class CourseRepository {
	create = async (payload: Partial<ICourse>) => {
		return await knexDb.table('courses').insert(payload).returning('*');
	};

	findById = async (id: string): Promise<ICourse | null> => {
		return await knexDb.table('courses').where({ id }).first();
	};

	update = async (id: string, payload: Partial<ICourse>): Promise<ICourse[]> => {
		return await knexDb('courses')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	findAll = async () => {
		return await knexDb.table('courses').orderBy('created_at', 'desc');
	};

	findAllForClients = async (): Promise<ICourse[]> => {
		return await knexDb.table('courses').where({ isDeleted: false, status: 'published' }).orderBy('created_at', 'desc');
	};
}

export const courseRepository = new CourseRepository();
