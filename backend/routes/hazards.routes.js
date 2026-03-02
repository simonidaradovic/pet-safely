import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  createHazard,
  listHazards,
  getHazardById,
  updateHazard,
  deleteHazard,
  setHazardStatus,
} from '../controllers/hazards.controller.js';

const router = Router();

router.get('/', listHazards);
router.get('/:id', getHazardById);

router.post('/', requireAuth, createHazard);
router.patch('/:id', requireAuth, updateHazard);
router.patch('/:id/status', requireAuth, setHazardStatus);
router.delete('/:id', requireAuth, deleteHazard);

export default router;
