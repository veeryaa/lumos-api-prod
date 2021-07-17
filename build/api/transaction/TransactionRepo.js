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
exports.readTransactionByDate = exports.readTransactionByCustomerId = exports.getListRecommendation = exports.createDataRecommendation = exports.claimTrxByCustomer = exports.readTransactionById = exports.readAllTransaction = exports.createDataTransaction = void 0;
const client_1 = require(".prisma/client");
const CustomerRepo_1 = require("../customer/CustomerRepo");
const MembershipRepo_1 = require("../membership/MembershipRepo");
const prisma = new client_1.PrismaClient({ rejectOnNotFound: true });
function createDataRecommendation(recommendation) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deleteFirst = prisma.recommendation.deleteMany();
            const result = prisma.recommendation.createMany({
                data: recommendation,
            });
            const finalQuery = yield prisma.$transaction([deleteFirst, result]);
            return [finalQuery, true];
        }
        catch (err) {
            console.log(err);
            return [err, false];
        }
    });
}
exports.createDataRecommendation = createDataRecommendation;
function createDataTransaction(body, point, detailTrx, employee_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id, date, total } = body;
            const trx = {
                trx_id: id,
                tgl_transaksi: new Date(date),
                point,
                nilai_transaksi: Number(total),
                employee: {
                    connect: {
                        employee_id,
                    },
                },
                customer: {
                    connect: {
                        customer_id: 4,
                    },
                },
            };
            const insertTrx = prisma.transaction.create({
                data: trx,
            });
            const insertTrxDetail = prisma.transactionDetail.createMany({
                data: detailTrx,
            });
            const finalQuery = yield prisma.$transaction([insertTrx, insertTrxDetail]);
            return [finalQuery, true];
        }
        catch (err) {
            console.log(err);
            return [err, false];
        }
    });
}
exports.createDataTransaction = createDataTransaction;
function readTransactionByCustomerId(customer_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const read = yield prisma.transaction.findMany({
                where: {
                    customer_id: Number(customer_id),
                },
            });
            return [read, true];
        }
        catch (err) {
            console.log(err);
            return [err, 'Error'];
        }
    });
}
exports.readTransactionByCustomerId = readTransactionByCustomerId;
function readTransactionByDate(tgl_awal, tgl_akhir) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(tgl_awal);
            console.log(tgl_akhir);
            const readCount = yield prisma.transaction.count({
                where: {
                    tgl_transaksi: {
                        gte: new Date(tgl_awal),
                    },
                    AND: {
                        tgl_transaksi: {
                            lte: new Date(tgl_akhir),
                        },
                    },
                },
            });
            const read = yield prisma.transaction.findMany({
                where: {
                    tgl_transaksi: {
                        gte: new Date(tgl_awal),
                    },
                    AND: {
                        tgl_transaksi: {
                            lte: new Date(tgl_akhir),
                        },
                    },
                },
                include: {
                    TransactionDetail: {
                        select: {
                            product: {
                                select: {
                                    nama_produk: true
                                }
                            }
                        }
                    }
                }
            });
            return [{ read, count: readCount }, true];
        }
        catch (err) {
            console.log(err);
            return [err, 'Error'];
        }
    });
}
exports.readTransactionByDate = readTransactionByDate;
function readAllTransaction(page) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const readCount = yield prisma.transaction.count();
            console.log(page);
            if (Number(page) > 0) {
                const read = yield prisma.transaction.findMany({
                    skip: Number(page) * 50 - 50,
                    take: 50,
                });
                return [{ read, count: readCount }, true];
            }
            else {
                const read = yield prisma.transaction.findMany();
                return [{ read, count: readCount }, true];
            }
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.readAllTransaction = readAllTransaction;
function getListRecommendation() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const readCount = yield prisma.recommendation.count();
            const trxCount = yield prisma.transaction.count();
            const read = yield prisma.recommendation.findMany();
            return [{ read, count: readCount, trxCount }, true];
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.getListRecommendation = getListRecommendation;
function claimTrxByCustomer(trx_id, cust_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const trx = yield readTransactionById(trx_id);
            const customer = yield CustomerRepo_1.findCustomerById(cust_id);
            const membership = yield MembershipRepo_1.findMembershipById(customer[0].membership_id);
            const nextMinimum = yield prisma.membership.findMany({
                where: {
                    minimum_poin: {
                        gt: membership[0].minimum_poin,
                    },
                },
            });
            if (trx[0].trx.customer_id !== 4)
                return ['Transaksi ini telah diklaim', 'Error'];
            console.log('-MINIMUM');
            console.log(nextMinimum);
            const updateTrx = prisma.transaction.update({
                where: {
                    trx_id,
                },
                data: {
                    customer_id: Number(cust_id),
                },
            });
            if (customer[0].point + trx[0].trx.point > nextMinimum[0].minimum_poin) {
                let customerRank = customer[0].membership_id;
                console.log('KESINI');
                if (customerRank === 'Bronze') {
                    customerRank = 'Silver';
                }
                else if (customerRank === 'Silver') {
                    customerRank = 'Gold';
                }
                const updateProfile = prisma.customer.update({
                    where: {
                        customer_id: Number(cust_id),
                    },
                    data: {
                        point: customer[0].point + trx[0].trx.point,
                        membership_id: customerRank,
                    },
                });
                const finalQuery = yield prisma.$transaction([updateTrx, updateProfile]);
                return [finalQuery, true];
            }
            else {
                const updateProfile = prisma.customer.update({
                    where: {
                        customer_id: Number(cust_id),
                    },
                    data: {
                        point: customer[0].point + trx[0].trx.point,
                    },
                });
                const finalQuery = yield prisma.$transaction([updateTrx, updateProfile]);
                return [finalQuery, true];
            }
        }
        catch (err) {
            console.log(err);
            return [err, 'Error'];
        }
    });
}
exports.claimTrxByCustomer = claimTrxByCustomer;
function readTransactionById(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const trxProduct = [];
            let trxAntecedent = [];
            let trxConsequent = [];
            const read = prisma.transaction.findUnique({
                where: {
                    trx_id: params,
                },
                include: {
                    TransactionDetail: {
                        include: {
                            product: true,
                        },
                    },
                    customer: true,
                },
            });
            const recommendation = prisma.recommendation.findMany({
                where: {
                    lift_ratio: {
                        gt: 0.999999,
                    },
                },
            });
            const [_read, _recommendation] = yield prisma.$transaction([read, recommendation]);
            _read.TransactionDetail.forEach((el) => {
                trxProduct.push(el.product.nama_produk);
            });
            _recommendation.forEach((el) => {
                if (trxProduct.toString().includes(el.antecedent.toString()) &&
                    !trxProduct.toString().includes(el.consequent.toString())) {
                    trxAntecedent = el.antecedent;
                    trxConsequent = el.consequent;
                    console.log(trxConsequent);
                    console.log(trxAntecedent);
                }
            });
            const trxResult = {
                trx: _read,
                rekomendasi: {
                    antecedent: trxAntecedent,
                    consequent: trxConsequent,
                },
            };
            return [trxResult, true];
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.readTransactionById = readTransactionById;
