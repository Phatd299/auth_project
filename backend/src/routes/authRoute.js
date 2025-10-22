import express from 'express';
import { SignUp } from '../controllers/authController.js';
import { SignIn } from '../controllers/authController.js';

const router = express.Router();

router.post('/SignUp', SignUp);

router.post('/SignIn', SignIn);

export default router;