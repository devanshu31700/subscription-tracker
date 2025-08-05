import { Router } from "express";
import authorize from '../middlewares/auth.middleware.js';
import { createSubscription, getUserSubscriptions } from "../Controllers/subscription.controller.js";


const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => res.send({title: 'Get all subscription details'}) );

subscriptionRouter.get('/:id', (req, res) => res.send({title: 'Get subscription details'}) );

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => res.send({title: 'Update subscription details'}) );

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.delete('/:id', (req, res) => res.send({title: 'Delete subscription '}) );

subscriptionRouter.put('/:id/cancel', (req, res) => res.send({title: 'Cancel subscription'}) );

subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({title: 'Get all upcoming renewals'}) );


export default subscriptionRouter;