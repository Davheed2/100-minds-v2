import { ContentType, SubmissionType, VideoUploadStatus } from '../constants';
//import { IQuiz } from './quiz';

export interface ICourse {
	id: string;
	title: string;
	description: string;
	status: string;
	userId: string;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}

export interface ICourseContent {
	id: string;
	title: string;
	description: string;
	videoUrl: string;
	fileUrl: string;
	contentType: ContentType;
	maxScore: string;
	submissionType: SubmissionType;
	dueDate: string;
	duration: string;
	uploadStatus: string;
	courseId: string;
	moduleId: string;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}

// export interface ICourseChapter {
// 	id: string;
// 	title: string;
// 	description: string;
// 	courseId: string;
// 	chapterNumber: number;
// 	chapterResources: string | null;
// 	isDeleted: boolean;
// 	created_at?: Date;
// 	updated_at?: Date;
// }

// export interface ICourseVideo {
// 	id: string;
// 	chapterId: string;
// 	videoURL: string;
// 	duration: string;
// 	uploadStatus: VideoUploadStatus;
// 	isDeleted: boolean;
// 	created_at?: Date;
// 	updated_at?: Date;
// }

// export interface ICourseWithModuleName extends ICourse {
// 	moduleName: string | null;
// }

// export interface ICourseChapterWithVideoUrl extends ICourseChapter {
// 	videoUrl: string;
// }

// export interface ICourseWithSkillsAndScenario {
// 	course: ICourse;
// 	scenarios: {
// 		scenarioId: string;
// 		scenarioName: string;
// 	}[];
// 	skills: {
// 		powerSkillId: string;
// 		powerSkillName: string;
// 	}[];
// }

// export interface ILesson {
// 	course: ICourse;
// 	chapters: {
// 		id: string;
// 		title: string;
// 		chapterNumber: number;
// 		chapterResources: string;
// 		videos: ICourseVideo[];
// 		//quiz: IQuiz[];
// 		created_at?: Date;
// 		updated_at?: Date;
// 	}[];
// }

// export interface IChapterLesson {
// 	course: Pick<ICourse, 'id' | 'name' | 'courseResources'>;
// 	chapter: ICourseChapter;
// 	quiz: IQuiz[];
// 	rolePlay: IScenario;
// 	video: ICourseVideo;
// }
