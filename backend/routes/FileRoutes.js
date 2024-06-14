import express from 'express';
import multer from 'multer';
import { uploadFile, getFiles, deleteFile } from '../controllers/Files.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadFile);
router.get('/get-files', getFiles);
router.delete('/delete/:index', deleteFile);

export default router;
