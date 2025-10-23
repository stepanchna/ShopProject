import { Router } from 'express';
import {
  getProducts,
  getNewProduct,
  postNewProduct,
  getProductPage,
  postProductChanges,
} from '../controllers/admin.controller';

const router = Router();
router.get('/', getProducts);
router.get('/new-product', getNewProduct);
router.post('/new-product', postNewProduct);
router.get('/:id', getProductPage);
router.post('/:id', postProductChanges);

export default router;
