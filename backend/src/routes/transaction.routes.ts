import { Router } from 'express';
import {
    getTransactions,
    deposit,
    withdraw,
    transfer,
    amountSchema,
    transferSchema,
} from '../controllers/transaction.controller';
import authMiddleware from '../middleware/auth.middleware';
import validate from '../middleware/validate.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getTransactions);
router.post('/deposit', validate(amountSchema), deposit);
router.post('/withdraw', validate(amountSchema), withdraw);
router.post('/transfer', validate(transferSchema), transfer);

export default router;
