import { Router } from 'express';
import EmployeeRoute from './employee/EmployeeRoute';
import ProductRoute from './product/ProductRoute';
import MembershipRoute from './membership/MembershipRoute';
import CouponRoute from './coupon/CouponRoute';
import CustomerRoute from './customer/CustomerRoute';
import TrxRoute from './transaction/TransactionRoute';
import passport from 'passport';

const router = Router();

router.use('/employee', EmployeeRoute);
router.use('/product', ProductRoute);
router.use('/membership', MembershipRoute);
router.use('/coupon',   CouponRoute);
router.use('/customer', CustomerRoute);
router.use('/transaction', TrxRoute);

export default router;
