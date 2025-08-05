import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import {JWT_EXPIRES_IN, JWT_SECRET} from '../config/env.js';
import bcrypt from "bcryptjs";
import User from '../models/user.model.js';

export const signUp = async(req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if(existingUser) {
            const error = new Error('This user already exists');
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt( 10 );
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create([{ name, email, password: hashedPassword }], { session });

        const token = jwt.sign( { userId: newUser[0]._id}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN});



        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUser[0],
            }
        })
    } catch(error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

export const signIn = async(req, res, next) => {
     try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("Invalid email or password");
            error.statusCode = 404;
            throw error;
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }

        // 3. Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // 4. Respond with token
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: {
                token,
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const signOut = async(req, res, next) => {
     try {
        // For stateless JWTs, we don't do much server-side.
        // Just tell the client to delete the token.
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
};
