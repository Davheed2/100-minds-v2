
export interface IModule {
	id: string;
	title: string;
	description: string | null;
    courseId: string;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}