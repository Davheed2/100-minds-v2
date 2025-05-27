
export interface IModule {
	id: string;
	name: string;
    courseId: string;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}