import express from 'express';
import User from '../models/User.js';

export const GetUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-hashedPassword');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};