import { multerUpload } from '@/common/config';
import { courseController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

router.use(protect);

/**
 * @openapi
 * /course/create:
 *   post:
 *     summary: Create a new course
 *     description: Allows a super admin to create a new course by providing a title and description. The endpoint validates the user's authentication and role, ensures the required fields are provided, and creates a course record associated with the authenticated user.
 *     tags:
 *       - Courses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Course Title"
 *                 description: The title of the course
 *               description:
 *                 type: string
 *                 example: "Course description"
 *                 description: A brief description of the course
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "0febdba2-b1d7-43a4-804f-a4ab70e729cc"
 *                       title:
 *                         type: string
 *                         example: "Course Title"
 *                       description:
 *                         type: string
 *                         example: "Course description"
 *                       status:
 *                         type: string
 *                         example: "draft"
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: "e81e635a-b144-4cb7-a702-a35f5d60e8d4"
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-27T20:57:52.864Z"
 *                 message:
 *                   type: string
 *                   example: "Course created successfully"
 *       400:
 *         description: Bad Request - User not logged in or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Title and description are required"
 *       403:
 *         description: Forbidden - Only super admins can create courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Only super admins can create courses"
 *       500:
 *         description: Internal Server Error - Failed to create course
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Failed to create course"
 */
router.post('/create', courseController.createCourse);
/**
 * @openapi
 * /course/all:
 *   get:
 *     summary: Retrieve all courses
 *     description: Retrieves a list of courses based on the user's role. Super admins and client admins can view all courses, while regular users can only view published courses. The endpoint validates the user's authentication and role, and returns the appropriate course list.
 *     tags:
 *       - Courses
 *     responses:
 *       200:
 *         description: Courses retrieved successfully or no courses found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "942ae4ce-1108-4f3c-8f4a-f043064942ce"
 *                       title:
 *                         type: string
 *                         example: "Course Title 2"
 *                       description:
 *                         type: string
 *                         example: "Course description 2"
 *                       status:
 *                         type: string
 *                         example: "draft"
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: "e81e635a-b144-4cb7-a702-a35f5d60e8d4"
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-27T21:46:25.823Z"
 *                 message:
 *                   type: string
 *                   example: "Courses retrieved successfully"
 *       400:
 *         description: Bad Request - User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Please log in again"
 *       403:
 *         description: Forbidden - Only super admins can view all courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Only super admins can view all courses"
 */
router.get('/all', courseController.getAllCourses);
/**
 * @openapi
 * /course/create-module:
 *   post:
 *     summary: Create a new module
 *     description: Allows a super admin to create a new module by providing a title, description, and course ID. The endpoint validates the user's authentication and role, ensures the required fields are provided, and creates a module record associated with the specified course.
 *     tags:
 *       - Courses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - courseId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Course Title Module"
 *                 description: The title of the module
 *               description:
 *                 type: string
 *                 example: "Course description module"
 *                 description: A brief description of the module
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: "942ae4ce-1108-4f3c-8f4a-f043064942ce"
 *                 description: The ID of the course to which the module belongs
 *     responses:
 *       201:
 *         description: Module created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "d3a5d648-6077-46de-b051-d904fe428773"
 *                       title:
 *                         type: string
 *                         example: "Course Title Module"
 *                       description:
 *                         type: string
 *                         example: "Course description module"
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: "942ae4ce-1108-4f3c-8f4a-f043064942ce"
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-27T21:52:21.892Z"
 *                 message:
 *                   type: string
 *                   example: "Module created successfully"
 *       400:
 *         description: Bad Request - User not logged in or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Title, and courseId are required"
 *       403:
 *         description: Forbidden - Only super admins can create modules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Only super admins can create modules"
 *       500:
 *         description: Internal Server Error - Failed to create module
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Failed to create module"
 */
router.post('/create-module', courseController.createModule);
/**
 * @openapi
 * /course/course-modules:
 *   get:
 *     summary: Retrieve all modules for a specific course
 *     description: Retrieves a list of modules associated with a given course ID. The endpoint validates the user's authentication and ensures the course ID is provided, then fetches all modules for the specified course.
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "942ae4ce-1108-4f3c-8f4a-f043064942ce"
 *         description: The ID of the course for which to retrieve modules
 *     responses:
 *       200:
 *         description: Course modules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "d3a5d648-6077-46de-b051-d904fe428773"
 *                       title:
 *                         type: string
 *                         example: "Course Title Module"
 *                       description:
 *                         type: string
 *                         example: "Course description module"
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: "942ae4ce-1108-4f3c-8f4a-f043064942ce"
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-27T21:52:21.892Z"
 *                 message:
 *                   type: string
 *                   example: "Course Modules retrieved successfully"
 *       400:
 *         description: Bad Request - User not logged in or courseId is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "CourseId is required"
 *       500:
 *         description: Internal Server Error - No modules found for this course
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "No modules found for this course"
 */
router.get('/course-modules', courseController.getAllModulesByCourseId);
/**
 * @openapi
 * /course/course-content:
 *   post:
 *     summary: Create new course content
 *     description: Allows an authenticated user to create course content for a specific module within a course. The endpoint supports multiple content types (text, quiz, video, file, assignment), each with specific required fields. It validates user authentication, required fields based on content type, and creates the content record accordingly. For video content, it generates a pre-signed URL for file upload. For file content, it uploads the provided file.
 *     tags:
 *       - Courses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - moduleId
 *               - contentType
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: "942ae4ce-1108-4f3c-8f4a-f043064942ce"
 *                 description: The ID of the course to which the content belongs
 *               moduleId:
 *                 type: string
 *                 format: uuid
 *                 example: "d3a5d648-6077-46de-b051-d904fe428773"
 *                 description: The ID of the module to which the content belongs
 *               contentType:
 *                 type: string
 *                 enum: [text, quiz, video, file, assignment]
 *                 example: "assignment"
 *                 description: The type of content being created
 *               title:
 *                 type: string
 *                 example: "Assignment content"
 *                 description: The title of the content (required for text, quiz, video, file, assignment)
 *               description:
 *                 type: string
 *                 example: "Assignment content description"
 *                 description: A description of the content (required for quiz, video, assignment; optional for text, file)
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: null
 *                 description: The due date for assignment content (optional for assignment)
 *               maxScore:
 *                 type: string
 *                 example: "100"
 *                 description: The maximum score for assignment content (required for assignment)
 *               submissionType:
 *                 type: string
 *                 example: "text_submission"
 *                 description: The submission type for assignment content (required for assignment)
 *               fileName:
 *                 type: string
 *                 example: "video.mp4"
 *                 description: The name of the file for video content (required for video)
 *               fileType:
 *                 type: string
 *                 example: "video/mp4"
 *                 description: The MIME type of the file for video content (required for video)
 *               fileSize:
 *                 type: string
 *                 example: "10485760"
 *                 description: The size of the file in bytes for video content (required for video)
 *               videoLength:
 *                 type: string
 *                 example: "300"
 *                 description: The duration of the video in seconds for video content (required for video)
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload for file content type (required for file)
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: "942ae4ce-1108-4f3c-8f4a-f043064942ce"
 *               moduleId:
 *                 type: string
 *                 format: uuid
 *                 example: "d3a5d648-6077-46de-b051-d904fe428773"
 *               contentType:
 *                 type: string
 *                 enum: [text, quiz, video, file, assignment]
 *                 example: "file"
 *               title:
 *                 type: string
 *                 example: "File content"
 *               description:
 *                 type: string
 *                 example: "File content description"
 *     responses:
 *       201:
 *         description: Course content created successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   description: Response for text, quiz, file, or assignment content types
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: success
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: "af859778-653d-4103-b102-9b9e549e4678"
 *                           title:
 *                             type: string
 *                             example: "Assignment content"
 *                           description:
 *                             type: string
 *                             example: "Assignment content description"
 *                           videoUrl:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           fileUrl:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           maxScore:
 *                             type: string
 *                             nullable: true
 *                             example: "100"
 *                           dueDate:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                             example: null
 *                           submissionType:
 *                             type: string
 *                             nullable: true
 *                             example: "text_submission"
 *                           contentType:
 *                             type: string
 *                             example: "assignment"
 *                           duration:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           uploadStatus:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           courseId:
 *                             type: string
 *                             format: uuid
 *                             example: "942ae4ce-1108-4f3c-8f4a-f043064942ce"
 *                           moduleId:
 *                             type: string
 *                             format: uuid
 *                             example: "d3a5d648-6077-46de-b051-d904fe428773"
 *                           isDeleted:
 *                             type: boolean
 *                             example: false
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-05-28T02:14:18.813Z"
 *                     message:
 *                       type: string
 *                       example: "Course assignment content created successfully"
 *                 - type: object
 *                   description: Response for video content type
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: success
 *                     data:
 *                       type: object
 *                       properties:
 *                         signedUrl:
 *                           type: string
 *                           example: "https://presigned-url.example.com/upload"
 *                           description: Pre-signed URL for uploading the video file
 *                         key:
 *                           type: string
 *                           example: "videos/course-video-123.mp4"
 *                           description: The key for the video file in storage
 *                     message:
 *                       type: string
 *                       example: "Course video content created successfully"
 *       400:
 *         description: Bad Request - Missing required fields, invalid content type, or only one text file allowed per module
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "CourseId, moduleId and contentType are required"
 *       500:
 *         description: Internal Server Error - Failed to create course content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Failed to create course assignment content"
 */
/**
 * @openapi
 * /presigned-url:
 *   put:
 *     summary: Upload a video using a pre-signed URL
 *     description: Uploads a video file to the storage service using the pre-signed URL obtained from the create course video content endpoint. The request body should contain the binary video file.
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: query
 *         name: signedUrl
 *         required: true
 *         schema:
 *           type: string
 *         example: "https://mock-presigned-url.s3.amazonaws.com/upload?X-Amz-Algorithm=AWS4-HMAC-SHA256"
 *         description: The pre-signed URL provided by the create course video content endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: string
 *             format: binary
 *             description: The binary video file to upload
 *     responses:
 *       200:
 *         description: Course video content created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {}
 *               description: No data is returned upon successful upload
 *       403:
 *         description: Forbidden - Invalid or expired pre-signed URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "The request signature we calculated does not match the signature you provided"
 *       500:
 *         description: Internal Server Error - Failed to upload the video
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Failed to upload the video to the storage service"
 */
router.post('/course-content', multerUpload.single('fileContent'), courseController.createCourseContent);

export { router as courseRouter };
