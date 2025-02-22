import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connetDB from './database/db.js';

dotenv.config({});
connetDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URI, credentials: true }));

app.use('/api/v1/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server listen at port : ${PORT}`);
});
