import express from 'express';
import cors from 'cors';
import apiRouter from '../src/server/api.js';

const app = express();
app.use(express.json());
app.use(cors());

// Map everything to apiRouter
app.use('/api', apiRouter);

export default app;
