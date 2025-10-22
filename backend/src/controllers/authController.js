import bcrypt from 'bcrypt'
import User from '../models/User.js';

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