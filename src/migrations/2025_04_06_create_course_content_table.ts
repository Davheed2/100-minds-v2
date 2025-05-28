import { ContentType, SubmissionType } from '../common/constants';
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('course_content', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.string('title').notNullable();
		table.text('description').nullable();
		table.string('videoUrl').nullable();
		table.string('fileUrl').nullable();
		table.string('maxScore').nullable();
		table.string('dueDate').nullable();
		table.enum('submissionType', Object.values(SubmissionType));
		table.enum('contentType', Object.values(ContentType));
		table.string('duration').nullable();
		table.string('uploadStatus').nullable();
		table.uuid('courseId').notNullable().references('id').inTable('courses').onDelete('SET NULL');
		table.uuid('moduleId').notNullable().references('id').inTable('course_modules').onDelete('SET NULL');
		table.boolean('isDeleted').defaultTo(false);
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('course_content');
}
