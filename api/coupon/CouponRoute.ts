import { Router } from 'express';
import {
  claimCouponController,
  createController,
  findByIdController,
  readAllController,
  readCouponOwnerController,
  updateController,
} from './CouponController';

const CouponRoute: Router = Router();

CouponRoute.post('/create', createController);
CouponRoute.get('/find/:id', findByIdController);
CouponRoute.get('/read', readAllController);
CouponRoute.get('/ownerread/:id', readCouponOwnerController);
CouponRoute.put('/update/:id', updateController);
CouponRoute.post('/claimCoupon', claimCouponController);
  
export default CouponRoute;
