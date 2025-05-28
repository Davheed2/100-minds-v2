import { knexDb } from '@/common/config';
import { ICourse, ICourseContent, IModule } from '@/common/interfaces';
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

	findCourseByIdWithModulesAndContent = async (
		id: string
	): Promise<(ICourse & { modules: (IModule & { contents: ICourseContent[] })[] }) | null> => {
		const course: ICourse | undefined = await knexDb.table('courses').where({ id, isDeleted: false }).first();

		if (!course) return null;

		const modules: IModule[] = await knexDb.table('course_modules').where({ courseId: course.id, isDeleted: false });

		const modulesWithContents = await Promise.all(
			modules.map(async (module) => {
				const contents: ICourseContent[] = await knexDb
					.table('course_content')
					.where({ moduleId: module.id, isDeleted: false });

				return {
					...module,
					contents,
				};
			})
		);

		return {
			...course,
			modules: modulesWithContents,
		};
	};
}

export const courseRepository = new CourseRepository();
