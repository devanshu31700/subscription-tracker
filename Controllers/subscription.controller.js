
import Subscription from '../models/subscription.model.js';
import { Error } from 'mongoose';


export const createSubscription = async (req, res, next) => {
    try{
        const subscription = await Subscription.create( {
            ...req.body,
            user: req.user._id,
        });

       const workflowResponse = await WorkflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'Content-Type': 'application/json',
            },
            retries: 0,
        })

        const { workflowRunId } = workflowResponse.data || {};
        res.status(201).json({ success: true, data: {subscription, workflowRunId }});

    } catch(error) {
        next(error);
    }
}


export const getUserSubscriptions = async(req, res, next) => {
    try{
        if(req.use._id != req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status= 401;
            throw error;
        }

        const subscription = await Subscription.find({user: req.params.id});
    
    
        res.status(200).json({success: true, data: subscription});
    
    } catch(e) {
        next(e);
    }
}