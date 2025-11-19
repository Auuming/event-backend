/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - name
*         - email
*         - tel
*         - password
*       properties:
*         name:
*           type: string
*           description: Name of user
*         email:
*           type: string
*           description: Email of user
*         tel:
*           type: string
*           description: Telephone number of user
*         role:
*           type: string
*           enum: [member, admin]
*           description: Role of user (member or admin), default is member
*         password:
*           type: string
*           description: Password of user 
*         createdAt:
*           type: string
*           format: date
*           example: '2023-08-20'
*           description: Date of creation (default is current date-time)
*/

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/


/**
* @swagger
* tags:
*   name: Authentication
*   description: The authentication API
*/

const express = require("express");
const { register, login, getMe, logout, updateUser, deleteUser } = require("../controllers/auth");
const router = express.Router();
const { protect } = require("../middleware/auth");

/**
* @swagger
* /auth/register:
*   post:
*     summary: Create a new user
*     tags: [Authentication]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       201:
*         description: The user was successfully created
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 _id:
*                   type: string
*                 name:
*                   type: string
*                 email:
*                   type: string
*                 token:
*                   type: string
*       400:
*         description: Bad request
*       500:
*         description: Some server error
*/
router.post("/register", register);

/**
* @swagger
* /auth/login:
*   post:
*     summary: Log-in to the system
*     tags: [Authentication]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties: 
*               email: 
*                   type: string
*                   description: User email
*               password: 
*                   type: string
*                   description: User password
*     responses:
*       200:
*         description: Log-in Successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 _id:
*                   type: string
*                 name:
*                   type: string
*                 email:
*                   type: string
*                 token:
*                   type: string
*       400:
*         description: Bad request
*       401:
*         description: Invalid credentials
*       500:
*         description: Some server error
*/
router.post("/login", login);

/**
* @swagger
* /auth/logout:
*   get:
*     summary: Log out user
*     tags: [Authentication]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Logged out successfully
*       401:
*         description: Not authorized
*/
router.get("/logout", protect, logout);

/**
* @swagger
* /auth/me:
*   get:
*     security:
*       - bearerAuth: []
*     summary: Return information about current user
*     tags: [Authentication]
*     responses:
*       200:
*         description: Current user profile
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 data:
*                   $ref: '#/components/schemas/User'
*       401:
*         description: Not authorized
*       500:
*         description: Some server error
*   put:
*     security:
*       - bearerAuth: []
*     summary: Update current user profile (name and tel only)
*     tags: [Authentication]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 description: Updated name
*               tel:
*                 type: string
*                 description: Updated telephone number
*     responses:
*       200:
*         description: User updated successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 data:
*                   $ref: '#/components/schemas/User'
*       400:
*         description: Bad request - no fields provided
*       401:
*         description: Not authorized
*       404:
*         description: User not found
*       500:
*         description: Some server error
*   delete:
*     security:
*       - bearerAuth: []
*     summary: Delete current user account
*     description: Deletes the current user's account and all associated ticketing reservations. Tickets are restored to events.
*     tags: [Authentication]
*     responses:
*       200:
*         description: User account deleted successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 message:
*                   type: string
*                   example: User account and all associated reservations deleted successfully
*       401:
*         description: Not authorized
*       404:
*         description: User not found
*       500:
*         description: Some server error
*/
router.get("/me", protect, getMe);
router.put("/me", protect, updateUser);
router.delete("/me", protect, deleteUser);

module.exports = router;
