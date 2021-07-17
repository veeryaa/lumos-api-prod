"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.generateEnumProduct = exports.readAllProductByKategori = exports.updateProduct = exports.readAllProduct = exports.findProductById = exports.createProduct = void 0;
const fs = __importStar(require("fs"));
const ProductRepo_1 = require("./ProductRepo");
function createProduct(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield ProductRepo_1.createProduct(body);
        return [result, status];
    });
}
exports.createProduct = createProduct;
function findProductById(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield ProductRepo_1.findProductById(params);
        return [result, status];
    });
}
exports.findProductById = findProductById;
function readAllProduct(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const [{ read, count }, status] = yield ProductRepo_1.readAllProduct(page);
        return [{ read, count }, status];
    });
}
exports.readAllProduct = readAllProduct;
function readAllProductByKategori(kategori, page) {
    return __awaiter(this, void 0, void 0, function* () {
        const [{ read, count }, status] = yield ProductRepo_1.readAllProductByKategori(kategori, page);
        return [{ read, count }, status];
    });
}
exports.readAllProductByKategori = readAllProductByKategori;
function updateProduct(params, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield ProductRepo_1.updateProduct(params, body);
        return [result, status];
    });
}
exports.updateProduct = updateProduct;
function generateEnumProduct(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const [{ read, count }, status] = yield ProductRepo_1.readAllProduct(page);
        const enumData = read.map((el) => {
            return `'${el.nama_produk}' = '${el.product_id}'`;
        });
        fs.writeFileSync('/home/fadelfirmansyah/Documents/Lumos Final Project/lumos-api-ts/helper/product.ts', `export enum PRODUCT {
    ${enumData}\n
  }`);
        return [{ read, count }, status];
    });
}
exports.generateEnumProduct = generateEnumProduct;
