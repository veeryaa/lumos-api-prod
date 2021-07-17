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
const client_1 = require(".prisma/client");
const prisma = new client_1.PrismaClient({ rejectOnNotFound: true });
function createCoupon(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { coupon_id, nama_kupon, product_id, diskon, tgl_mulai, tgl_berakhir } = body;
            const coupon = {
                coupon_id,
                nama_kupon,
                diskon: Number(diskon),
                tgl_mulai: new Date(tgl_mulai),
                tgl_berakhir: new Date(tgl_berakhir),
                product: {
                    connect: {
                        product_id
                    },
                },
            };
            const insert = yield prisma.coupon.create({
                data: coupon,
            });
            return [insert, true];
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.createCoupon = createCoupon;
function findCouponById(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const read = yield prisma.coupon.findUnique({
                where: {
                    coupon_id: params,
                },
                include: {
                    product: {
                        select: {
                            nama_produk: true
                        }
                    }
                }
            });
            return [read, true];
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.findCouponById = findCouponById;
function readAllCoupon() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const read = yield prisma.coupon.findMany({
                include: {
                    product: {
                        select: {
                            nama_produk: true
                        }
                    }
                }
            });
            return [read, true];
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.readAllCoupon = readAllCoupon;
function updateCoupon(params, body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { nama_kupon, product_id, diskon, tgl_mulai, tgl_berakhir } = body;
            console.log(params);
            const coupon = {
                nama_kupon,
                diskon: Number(diskon),
                tgl_mulai: new Date(tgl_mulai),
                tgl_berakhir: new Date(tgl_berakhir),
                product: {
                    connect: {
                        product_id,
                    },
                },
            };
            const update = yield prisma.coupon.update({
                where: {
                    coupon_id: params,
                },
                data: coupon,
            });
            return [update, true];
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.updateCoupon = updateCoupon;
