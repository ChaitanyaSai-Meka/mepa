import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './api/auth/auth.controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;