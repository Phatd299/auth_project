import express from 'express';
import dotenv from 'dotenv';
import connectDB from './libs/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import protectRoute from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

//Middleware
app.use(cookieParser());
app.use(express.json());

// Public Routes
app.use('/api/auth', authRoute);

// Private Route
app.use(protectRoute);
app.use('/api/user', userRoute);


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
