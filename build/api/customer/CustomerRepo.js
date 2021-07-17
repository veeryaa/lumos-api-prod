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
exports.updateCustomer = exports.findCustomerById = exports.readAllCustomerByMembership = exports.readAllCustomer = exports.createCustomer = void 0;
const client_1 = require(".prisma/client");
const prisma = new client_1.PrismaClient({ rejectOnNotFound: true });
function createCustomer(body, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { handphone, email } = body;
            const customer = {
                nama: '',
                kota: '',
                email,
                tanggal_lahir: new Date('2000-01-01'),
                point: 10,
                membership: {
                    connect: {
                        membership_id: 'Bronze',
                    },
                },
                CustomerAccount: {
                    create: {
                        handphone,
                        password: hash,
                    },
                },
            };
            const insert = yield prisma.customer.create({
                data: customer,
                select: {
                    customer_id: true,
                    email: true,
                    CustomerAccount: {
                        select: {
                            handphone: true,
                        },
                    },
                },
            });
            console.log('SUKSES');
            return [insert, true];
        }
        catch (err) {
            console.log(err);
            return [err, 'Error'];
        }
    });
}
exports.createCustomer = createCustomer;
function findCustomerById(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const read = yield prisma.customer.findUnique({
                where: {
                    customer_id: Number(params),
                },
                include: {
                    CustomerAccount: {
                        select: {
                            handphone: true,
                        },
                    },
                },
            });
            return [read, true];
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.findCustomerById = findCustomerById;
function readAllCustomer(page) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const readCount = yield prisma.customer.count();
            if (Number(page) > 0) {
                const read = yield prisma.customer.findMany({
                    skip: Number(page) * 10 - 10,
                    take: 10,
                    where: {
                        customer_id: {
                            not: 4
                        }
                    }
                });
                return [{ read, count: readCount }, true];
            }
            else {
                const read = yield prisma.customer.findMany({
                    where: {
                        customer_id: {
                            not: 4
                        }
                    }
                });
                return [{ read, count: readCount }, true];
            }
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.readAllCustomer = readAllCustomer;
function readAllCustomerByMembership(membership, page) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const readCount = yield prisma.customer.count({
                where: {
                    membership_id: membership,
                },
            });
            console.log('count: ', readCount);
            if (Number(page) > 0) {
                const read = yield prisma.customer.findMany({
                    where: {
                        membership_id: membership,
                    },
                    skip: Number(page) * 10 - 10,
                    take: 10,
                    include: {
                        CustomerAccount: {
                            select: { handphone: true },
                        },
                    },
                });
                return [{ read, count: readCount }, true];
            }
            else {
                const read = yield prisma.customer.findMany({
                    where: {
                        membership_id: membership,
                    },
                    include: {
                        CustomerAccount: {
                            select: { handphone: true },
                        },
                    },
                });
                return [{ read, count: readCount }, true];
            }
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.readAllCustomerByMembership = readAllCustomerByMembership;
function updateCustomer(params, body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { nama, kota, tanggal_lahir } = body;
            console.log(params);
            const customer = {
                nama,
                kota,
                tanggal_lahir,
            };
            const update = yield prisma.customer.update({
                where: {
                    customer_id: Number(params),
                },
                data: customer,
            });
            return [update, true];
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.updateCustomer = updateCustomer;
