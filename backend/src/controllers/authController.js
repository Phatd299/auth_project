import bcrypt from 'bcrypt'
import User from '../models/User.js';
import Session from '../models/Session.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;

export const SignUp = async (req, res) => {
    try {
        const { username, password, email, firstname, lastname } = req.body;

        if (!username || !password || !email || !firstname || !lastname) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const duplicate = await User.findOne({username});

        if (duplicate) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstname} ${lastname}`,
        });

        return res.status(201).json({ message: 'User registered successfully.' });
    }
    catch (error) {
        console.error('Error during sign up:', error);
        res.status(500).json({ message: 'Internal server error.' });
    } 
};

export const SignIn = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Create bearer / access token
        const accessToken = jwt.sign(
            {userId: user._id},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );

        // create refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');

        await Session.create({
            userId: user._id,
            refreshToken: refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL), // 7 days
        });

        // Send refresh token as httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: REFRESH_TOKEN_TTL, // 7 days
        });

        // send access token in response header
        res.setHeader('Authorization', `Bearer ${accessToken}`);
        
        return res.status(200).json({ message: 'Sign in successful.' });

    } catch (error) {
        console.error('Error during sign in:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
