import { Knex } from 'knex';
import { CourseStatus } from '../common/constants';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('courses', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.string('title').notNullable();
		table.string('description').notNullable();
		table.enum('status', Object.values(CourseStatus)).defaultTo(CourseStatus.DRAFT);
		table.uuid('userId').notNullable().references('id').inTable('users').onDelete('SET NULL');
		table.boolean('isDeleted').defaultTo(false);
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('courses');
}
