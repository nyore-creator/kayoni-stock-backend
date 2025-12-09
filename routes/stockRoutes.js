import { Router } from 'express';
import { addStockIn, addStockOut, getReport } from '../controllers/stockController.js';

const router = Router();

router.post('/in', addStockIn);
router.post('/out', addStockOut);
router.get('/report', getReport);

export default router;
