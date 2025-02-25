import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Database Connected Successfully...!');
    } catch (error) {
        console.log('Database Not Connected...!');
    }
}

export default connectDB;