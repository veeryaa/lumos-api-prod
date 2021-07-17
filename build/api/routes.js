"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EmployeeRoute_1 = __importDefault(require("./employee/EmployeeRoute"));
const ProductRoute_1 = __importDefault(require("./product/ProductRoute"));
const MembershipRoute_1 = __importDefault(require("./membership/MembershipRoute"));
const CouponRoute_1 = __importDefault(require("./coupon/CouponRoute"));
const CustomerRoute_1 = __importDefault(require("./customer/CustomerRoute"));
const TransactionRoute_1 = __importDefault(require("./transaction/TransactionRoute"));
const router = express_1.Router();
router.use('/employee', EmployeeRoute_1.default);
router.use('/product', ProductRoute_1.default);
router.use('/membership', MembershipRoute_1.default);
router.use('/coupon', CouponRoute_1.default);
router.use('/customer', CustomerRoute_1.default);
router.use('/transaction', TransactionRoute_1.default);
exports.default = router;
