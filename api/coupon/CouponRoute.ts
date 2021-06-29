import { Router } from 'express';
import {
  createController,
  findByIdController,
  readAllController,
  updateController,
} from './CouponController';
import passport from 'passport';

const CouponRoute: Router = Router();

CouponRoute.post('/create', createController);
CouponRoute.get('/find/:id', findByIdController);
CouponRoute.get('/read', readAllController);
CouponRoute.put('/update/:id', updateController);

export default CouponRoute;
