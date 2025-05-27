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

export { router as courseRouter };
