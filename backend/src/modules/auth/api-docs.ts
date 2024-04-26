/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login a user
 *     description: Login a user into the system
 *     requestBody:
 *       description: Login request body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: abcde$12345
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *               example:
 *                 accessToken: qwejhbqj2heb231je.234jwer.234h324
 *                 refreshToken: qwbejqhwbejqwhe.asdqwe12e.qwe12e
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: array
 *                     password:
 *                       type: array
 *               example:
 *                 errors:
 *                   username:
 *                     - "username should not be empty"
 *                     - "username must be a string"
 *                   refreshToken:
 *                     - "password should not be empty"
 *                     - "password must be a string"
 */
