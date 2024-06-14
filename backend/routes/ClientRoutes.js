import express from 'express';
import {
  updateUser,
  deleteUser
} from '../controllers/Users.js';

const router = express.Router();


router.put('/user/update', updateUser);
router.delete('/user/delete', deleteUser);

export default router;
