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
//router.post('/make-admin', userController.makeAdmin);

export { router as courseRouter };
