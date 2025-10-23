import { Router } from 'express';
import * as ctrl from '../controllers/products.controller';

const router = Router();

router.get('/', ctrl.getAllProducts);

router.get('/:id', ctrl.getProductById);

router.get('/:id/related', ctrl.getRelated);

router.post('/related', ctrl.addRelated);

router.delete('/related', ctrl.deleteRelated);

router.post('/', ctrl.createProduct);

export default router;
