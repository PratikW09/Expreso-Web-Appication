import express from 'express';
import { createBlog, updateBlog, deleteBlog, likeBlog, getUserPosts, getAllPosts, getAllLikes, getPostById } from '../Controllers/blogContorller.js';
import { verifyJWT } from '../Middleware/authmiddleware.js';
import upload from '../Middleware/mullterMiddleware.js';

const router = express.Router();


router.post('/create', verifyJWT,upload.array('images', 5), createBlog);
router.patch('/update/:id', verifyJWT,upload.array('images', 5), updateBlog);
router.delete('/delete/:blogid', verifyJWT, deleteBlog);
router.post('/like/:blogid', verifyJWT, likeBlog);
router.get('/getUserPost', verifyJWT, getUserPosts);
router.get('/getAllLikes', verifyJWT, getAllLikes);
router.get('/getAllPost', getAllPosts);
router.get('/getsinglePost/:blogid', verifyJWT, getPostById);
// router.put('/update/:blogid', verifyJWT, updateBlog);

export default router;
