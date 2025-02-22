import mongoose from "mongoose";

const connetDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database Connected Successfully...!');
    } catch (error) {
        console.log('Database Not Connected...!');
    }
}

export default connetDB;