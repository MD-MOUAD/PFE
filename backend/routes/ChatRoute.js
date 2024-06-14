import express from 'express';
import { processInput } from '../controllers/Chat.js';

const router = express.Router();

router.post('/process', processInput);

export default router;
