"use strict";
/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management and authentication
 *   - name: Media
 *     description: Media uploads and management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediasPath = exports.usersPaths = exports.securitySchemes = void 0;
exports.securitySchemes = {
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
};
exports.usersPaths = {
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     description: |
 *       Get information about user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get profile successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
/**
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: Get user profile by username
 *     description: Get information the public profile of a user by their username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user to retrieve
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get profile successfully
 *                 user:
 *                   type: object
 *       404:
 *         description: User not found
 */
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirm_password
 *               - dateOfBirth
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: Password123
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "2000-01-01"
 *                 description: User's date of birth in YYYY-MM-DD format
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data or email already exists
 */
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     description: |
 *       Authenticates a user and returns tokens.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: somebody@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login success
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout user
 *     description: Invalidates the user's refresh token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to invalidate
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
/**
 * @swagger
 * /users/verify-email/{emailVerifyToken}:
 *   post:
 *     summary: Verify email address
 *     description: Verifies a user's email address using the provided token in the URL
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: emailVerifyToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token sent to user's email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
/**
 * @swagger
 * /users/resend-verify-email:
 *   post:
 *     summary: Resend verification email
 *     description: Sends a new verification email to the user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
/**
 * @swagger
 * /users/follow/{followedUserId}:
 *   post:
 *     summary: Follow a user
 *     description: Current user follows another user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: followedUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to follow
 *     responses:
 *       200:
 *         description: Successfully followed user
 *       400:
 *         description: Cannot follow yourself or already following
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User to follow not found
 */
/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update current user profile
 *     description: Updates the profile of the currently user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: JohnhDoe
 *               name:
 *                 type: string
 *                 example: John Doe Bill
 *               bio:
 *                 type: string
 *                 example: I'm a developer
 *               location:
 *                 type: string
 *                 example: 4816 Hillcrest Avenue
 *               website:
 *                 type: string
 *                 example: https://www.facebook.com/
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       400:
 *         description: Invalid input data
 */
/**
 * @swagger
 * /users/unfollow/{unfollowedUserId}:
 *   delete:
 *     summary: Unfollow a user
 *     description: Current user unfollows another user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: unfollowedUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to unfollow
 *     responses:
 *       200:
 *         description: Successfully unfollowed user
 *       400:
 *         description: Cannot unfollow yourself or not following
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User to unfollow not found
 */
/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Change password
 *     description: Changes the password of the currently authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - password
 *               - confirm_password
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: OldPassword123
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input or incorrect old password
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
};
exports.mediasPath = {
/**
 * @swagger
 * /medias/upload-image:
 *   post:
 *     summary: Upload images
 *     description: Upload up to 4 images (max 300KB each)
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files to upload (up to 4 images, max 300KB each)
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Upload image successfully
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                         example: http://localhost:4000/static/images/image123456
 *                       type:
 *                         type: string
 *                         example: image
 *       400:
 *         description: Invalid file type or size
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Email not verified
 */
/**
 * @swagger
 * /medias/upload-video:
 *   post:
 *     summary: Upload video
 *     description: Upload a single video file (max 50MB)
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - video
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file to upload (max 50MB)
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Upload video successfully
 *                 result:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: http://localhost:4000/static/videos/video123456
 *                     type:
 *                       type: string
 *                       example: video
 *       400:
 *         description: Invalid file type or size
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Email not verified
 */
};
