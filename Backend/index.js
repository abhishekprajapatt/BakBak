import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './database/db.js';
import userRouter from './routes/user.route.js';
import messageRouter from './routes/message.route.js';

dotenv.config({});
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/message', messageRouter);

app.listen(PORT, () => {
  console.log(`Server listen at port : ${PORT}`);
});
