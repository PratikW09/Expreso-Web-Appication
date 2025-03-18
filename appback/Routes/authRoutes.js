import express from 'express';
import { registerUser, loginUser, logoutUser, getUserDetails } from '../Controllers/userContorller.js';
import { verifyJWT } from '../Middleware/authmiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyJWT, getUserDetails);
router.post('/logout', verifyJWT, logoutUser);

export default router;