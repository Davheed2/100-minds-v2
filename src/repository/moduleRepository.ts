import { knexDb } from '@/common/config';
import { IModule } from '@/common/interfaces';
import { DateTime } from 'luxon';

class ModuleRepository {
	create = async (payload: Partial<IModule>) => {
		return await knexDb.table('course_modules').insert(payload).returning('*');
	};

	findById = async (id: string): Promise<IModule | null> => {
		return await knexDb.table('course_modules').where({ id }).first();
	};

	update = async (id: string, payload: Partial<IModule>): Promise<IModule[]> => {
		return await knexDb('course_modules')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	findAll = async () => {
		return await knexDb.table('course_modules').orderBy('created_at', 'desc');
	};

	findAllByCourseId = async (courseId: string): Promise<IModule[]> => {
		return await knexDb.table('course_modules').where({ courseId }).orderBy('created_at', 'desc');
	};
}

export const moduleRepository = new ModuleRepository();
