import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';


export const getUsersProfile = async (req, res, next) => {
    try {
        const users = await User.findById(req.user.userId).select('-password');
        if (!users) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, users });
    } catch (error) {
        next(error);
    }};


// 1. View own profile
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// 2. Update user profile
export const updateUserProfile = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

// 3. Delete user
export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.user.userId);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

const userController = {
  getUsersProfile,
  getUserProfile,
  updateUserProfile,
  deleteUser,
};

export default userController;