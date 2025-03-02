import mongoose from 'mongoose';

// Connect to the database
mongoose.connect((process.env.MONGODB_URI as string));

mongoose.connection.on('error', (error) => {
    console.error("Database connection error:", error);
});

mongoose.connection.once('open', () => {
    console.log("Database connected");
});

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