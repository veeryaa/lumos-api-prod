import { Router } from 'express';
import {
  createController,
  findByIdController,
  readAllController,
  updateController,
  readAllByKategori,
  generateEnumController,
} from './ProductController';
import passport from 'passport';

const ProductRoute: Router = Router();

ProductRoute.post('/create', createController);
ProductRoute.get('/read', readAllController);
ProductRoute.get('/read/:kategori', readAllByKategori);
ProductRoute.get('/find/:id', findByIdController);
ProductRoute.put('/update/:id', updateController);
ProductRoute.post('/enum', generateEnumController);

export default ProductRoute;
