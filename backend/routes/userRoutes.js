import express from 'express';
import {
  updateUser,
  deleteUser,
  getUserById
} from '../controllers/unique.js';

const router = express.Router();

router.get('/edit/:id', getUserById);
router.put('/edit/:id', updateUser);
router.delete('/edit/:id', deleteUser);

export default router;
