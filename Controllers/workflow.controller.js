import { createRequire} from 'module';
import Subscription from '../models/subscription.model.js';
import dayjs from 'dayjs';
import { sendReminderEmail } from '../utils/send-email.js';
import { notStrictEqual } from 'assert';
const require = createRequire(import.meta.url);

const {serve} = require('@upstash/workflow/express')
const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(  async(context) => {
    const { subscriptionId} = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);
    if(!subscription || subscription.status!= 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
        return;
    }
    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if(reminderDate.isAfter(dayjs()))
            await sleepUntillReminder(context, `Reminder${daysBefore} days before`, reminderDate);
    }

    if(dayjs().isSame(reminderDate, 'day')) {
    await triggerReminder(context, `${daysBefore} days before reminder`);
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('run subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
}

const sleepUntillReminder = async(context, label, date) => {
    console.log(`Sleeping untill ${label} reminder at ${date}`);
    await context.sleepUntill(label, date.toDate());
}

const triggerReminder = async( context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);

        await sendReminderEmail( {
            to: subscription.user.email,
            type: label,
            subscription,
        })
    })
}