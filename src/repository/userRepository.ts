import { knexDb } from '@/common/config';
import { IUser } from '@/common/interfaces';
import { DateTime } from 'luxon';

class UserRepository {
	create = async (payload: Partial<IUser>) => {
		return await knexDb.table('users').insert(payload).returning('*');
	};

	findById = async (id: string): Promise<IUser | null> => {
		return await knexDb.table('users').where({ id }).first();
	};

	findByEmail = async (email: string): Promise<IUser | null> => {
		return await knexDb.table('users').where({ email }).first();
	};

	findByUsername = async (username: string): Promise<IUser | null> => {
		return await knexDb.table('users').where({ username }).first();
	};

	findByEmailOrUsername = async (email: string, username: string): Promise<IUser | null> => {
		return await knexDb.table('users').where({ email }).orWhere({ username }).first();
	};

	findByPasswordResetToken = async (passwordResetToken: string): Promise<IUser | null> => {
		return await knexDb
			.table('users')
			.where({ passwordResetToken })
			.where('passwordResetExpires', '>', DateTime.now().toJSDate())
			.where({ isSuspended: false })
			.first();
	};

	update = async (id: string, payload: Partial<IUser>): Promise<IUser[]> => {
		return await knexDb('users')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	findAll = async () => {
		return await knexDb.table('users').orderBy('created_at', 'desc');
	};

	findByRole = async (role: string) => {
		return await knexDb.table('users').where({ role });
	};

	findByIsSuspended = async (isSuspended: boolean) => {
		return await knexDb.table('users').where({ isSuspended });
	};

	findByIsDeleted = async (isDeleted: boolean) => {
		return await knexDb.table('users').where({ isDeleted });
	};

	findByVerificationToken = async (verificationToken: string): Promise<IUser | null> => {
		return await knexDb
			.table('users')
			.where({ verificationToken })
			.where('verificationTokenExpires', '>', DateTime.now().toJSDate())
			.first();
	};
}

export const userRepository = new UserRepository();
