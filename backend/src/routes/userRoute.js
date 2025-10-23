import express from 'express';
import { GetUser } from '../controllers/userController.js'; 

const router = express.Router();

router.get('/GetUser', GetUser);

export default router;