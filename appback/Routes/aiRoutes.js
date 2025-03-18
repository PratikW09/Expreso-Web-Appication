import  express from "express";
import {  generateKeywordController } from "../AI/generateKeywordController.js";
import { generateImageController } from "../AI/generateImageController.js";
// const { generateImageController } = require("../controllers/imageController");

const router = express.Router();

// POST /api/image/generate
router.post("/generate-keyword", generateKeywordController);
router.post("/generate-image", generateImageController);

export default router;
