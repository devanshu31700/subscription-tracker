import { Router } from "express";

const userRouter= Router();

userRouter.get( '/',  (req, res) => {res.send({title:'Get all Users'})});

userRouter.get( '/:id',  (req, res) => {res.send({title:'Get Users details'})});

userRouter.post( '/',  (req, res) => {res.send({title:'Update Users'})});

userRouter.put( '/:id',  (req, res) => {res.send({title:'Update Users'})});

userRouter.delete( '/:id',  (req, res) => {res.send({title:'Delete Users'})});

export default userRouter;