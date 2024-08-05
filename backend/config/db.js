import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://fiki123:fiki123@cluster0.odtghyt.mongodb.net/food-del?retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
