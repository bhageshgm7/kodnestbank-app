import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('MONGO_URI is not defined in environment variables');
        process.exit(1);
    }

    try {
        console.log(`🔗 Connecting to MongoDB at ${mongoUri}...`);
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', (error as Error).message);
        console.log('💡 Tip: Ensure MongoDB is installed and running on port 27017.');
        process.exit(1);
    }
};

export default connectDB;
