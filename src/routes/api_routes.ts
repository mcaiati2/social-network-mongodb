// - Imports the Router class from the Express library.
// - I got the ability to do this by running npm i express (didn't need to export)
import { Router } from 'express';

import {
  createUser,
  getAllUsers,
  getSingleUserById,
} from '../controllers/api_controller.js';

const router = Router();

// POST route to create a user
router.post('/users', createUser);

// GET route to get all users
router.get('/users', getAllUsers);

// GET route to get user info by ID
router.get('/user/:user_id', getSingleUserById);

export default router;