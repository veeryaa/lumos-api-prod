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
exports.readAllProductByKategori = exports.updateProduct = exports.readAllProduct = exports.findProductById = exports.createProduct = void 0;
const client_1 = require(".prisma/client");
const prisma = new client_1.PrismaClient({ rejectOnNotFound: true });
function createProduct(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { product_id, nama_produk, deskripsi, kategori, harga } = body;
            const product = {
                product_id,
                nama_produk,
                deskripsi,
                kategori,
                harga: Number(harga),
            };
            const insert = yield prisma.product.create({
                data: product,
            });
            return [insert, true];
        }
        catch (err) {
            console.error(err);
            return [err, 'Error'];
        }
    });
}
exports.createProduct = createProduct;
function findProductById(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const read = yield prisma.product.findUnique({
                where: {
                    product_id: params,
                },
            });
            return [read, true];
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.findProductById = findProductById;
function readAllProduct(page) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const readCount = yield prisma.product.count();
            if (Number(page) > 0) {
                const read = yield prisma.product.findMany({
                    skip: Number(page) * 10 - 10,
                    take: 10,
                });
                return [{ read, count: readCount }, true];
            }
            else {
                const read = yield prisma.product.findMany();
                return [{ read, count: readCount }, true];
            }
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.readAllProduct = readAllProduct;
function readAllProductByKategori(kategori, page) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const readCount = yield prisma.product.count({ where: { kategori } });
            if (Number(page) > 0) {
                const read = yield prisma.product.findMany({
                    where: {
                        kategori,
                    },
                    skip: Number(page) * 10 - 10,
                    take: 10,
                });
                return [{ read, count: readCount }, true];
            }
            else {
                const read = yield prisma.product.findMany({ where: { kategori } });
                return [{ read, count: readCount }, true];
            }
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.readAllProductByKategori = readAllProductByKategori;
function updateProduct(params, body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { nama_produk, deskripsi, kategori, harga } = body;
            const product = {
                nama_produk,
                deskripsi,
                kategori,
                harga: Number(harga),
            };
            const update = yield prisma.product.update({
                where: {
                    product_id: params,
                },
                data: product,
            });
            return [update, true];
        }
        catch (err) {
            console.error(err);
            return [err, 'Error'];
        }
    });
}
exports.updateProduct = updateProduct;
