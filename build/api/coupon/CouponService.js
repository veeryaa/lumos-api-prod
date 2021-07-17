"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCoupon = exports.readAllCoupon = exports.findCouponById = exports.createCoupon = void 0;
const CouponRepo_1 = require("./CouponRepo");
function createCoupon(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield CouponRepo_1.createCoupon(body);
        return [result, status];
    });
}
exports.createCoupon = createCoupon;
function findCouponById(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield CouponRepo_1.findCouponById(params);
        return [result, status];
    });
}
exports.findCouponById = findCouponById;
function readAllCoupon() {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield CouponRepo_1.readAllCoupon();
        return [result, status];
    });
}
exports.readAllCoupon = readAllCoupon;
function updateCoupon(params, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield CouponRepo_1.updateCoupon(params, body);
        return [result, status];
    });
}
exports.updateCoupon = updateCoupon;
