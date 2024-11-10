// - Imports the Router class from the Express library.
// - I got the ability to do this by running npm i express (didn't need to export)
import { Router } from 'express';

import {
  createUser
} from '../controllers/api_controller.js';

const router = Router();

router.post('/users', createUser);

export default router;