import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Subscription Name is required'],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        price: {
            type: number,
            required: [true, 'Subsciption price is required'],
            min: [0, 'Price must be greater than 0'],
            max: [1000, 'Price must be less than 1000'],
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'GBP', 'INR'],
            default: 'INR',
        },
        frequency: {
            type: String,
            enum: ['daily', 'monthly', 'yearly'],
        },
        category: {
            type: String,
            enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology'],
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['active', 'expired', 'cancelled'],
            default: 'active'
        },
        startDate: {
            type: Date,
            required: true,
            validate: {
                validator: (value) => value <= new Date(),
                message: 'Start date must be in the past',
            },
        },
        renewalDate: {
            type: Date,
            validate: {
                validator: function(value) {
                    return !value || value > this.startDate;
                },
                message: 'Renewal date must be after the start date',
            },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,

        }
    }, {timestamps: true}
);

subscriptionSchema.pre('Save', function(next){
if(!this.renewalDate) {
    const renewalPeriod = {
        daily: 1,
        monthly: 7,
        yearly: 365,
    };
    this.renewalDate= new Date(this.startDate);
    this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency] );
};
if(this.renewalDate < new Date()) {
    this.status = 'expired';
};

next();
});

const Subscription = mongoose.model( 'Subscription', subscriptionSchema);

export default Subscription;