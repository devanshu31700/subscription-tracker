import { Router } from "express";
import authorize from '../middlewares/auth.middleware.js';
import { getUsersProfile, getUserProfile, updateUserProfile, deleteUser } from "../Controllers/user.controller.js";

const userRouter= Router();

userRouter.get( '/',  getUsersProfile);

userRouter.get( '/:id', authorize ,getUserProfile);

userRouter.post( '/', updateUserProfile);

userRouter.put( '/:id',  (req, res) => {res.send({title:'Update Users'})});

userRouter.delete( '/:id', deleteUser );

export default userRouter;