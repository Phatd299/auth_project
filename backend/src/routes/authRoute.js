import express from 'express';
import { SignUp } from '../controllers/authController.js';
import { SignIn } from '../controllers/authController.js';
import { SignOut } from '../controllers/authController.js';

const router = express.Router();

router.post('/SignUp', SignUp);

router.post('/SignIn', SignIn);

router.post('/SignOut', SignOut);

export default router;