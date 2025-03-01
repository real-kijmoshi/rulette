import mongoose from 'mongoose';

// Connect to the database
mongoose.connect((process.env.MONGODB_URI as string));

const userSchema = new mongoose.Schema({
    auth: {
        provider: String,
        providerId: String,
    },
    balance: Number,
    email: String,
    name: String,
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export { User };