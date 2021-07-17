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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTransactionByCustomerId = exports.getListRecommendation = exports.exportTrxToCsv = exports.claimTrxByCustomer = exports.readTransactionByid = exports.readAllTransaction = exports.createDataTransaction = exports.savePdfToStorage = void 0;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const product_1 = require("../../helper/product");
const TransactionRepo_1 = require("./TransactionRepo");
function exportTrxToCsv(tglawal, tglakhir) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield TransactionRepo_1.readTransactionByDate(tglawal, tglakhir);
        return [result, status];
    });
}
exports.exportTrxToCsv = exportTrxToCsv;
function createDataTransaction(body, employee_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const rewardPoint = Math.round(Number(body.total) / 1000);
        const detailProduct = [];
        body.detail.forEach((e) => {
            detailProduct.push({
                trx_id: body.id,
                product_id: product_1.PRODUCT[e.nama_produk],
                kuantiti: Number(e.kuantiti),
            });
        });
        const [result, status] = yield TransactionRepo_1.createDataTransaction(body, rewardPoint, detailProduct, employee_id);
        console.log(detailProduct);
        return [result, status];
    });
}
exports.createDataTransaction = createDataTransaction;
function claimTrxByCustomer(trx_id, cust_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield TransactionRepo_1.claimTrxByCustomer(trx_id, cust_id);
        return [result, status];
    });
}
exports.claimTrxByCustomer = claimTrxByCustomer;
function getListRecommendation() {
    return __awaiter(this, void 0, void 0, function* () {
        const [{ read, count, trxCount }, status] = yield TransactionRepo_1.getListRecommendation();
        return [{ read, count, trxCount }, status];
    });
}
exports.getListRecommendation = getListRecommendation;
function readTransactionByCustomerId(customer_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const [read, status] = yield TransactionRepo_1.readTransactionByCustomerId(customer_id);
        return [read, status];
    });
}
exports.readTransactionByCustomerId = readTransactionByCustomerId;
function readAllTransaction(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const [{ read, count }, status] = yield TransactionRepo_1.readAllTransaction(page);
        return [{ read, count }, status];
    });
}
exports.readAllTransaction = readAllTransaction;
function readTransactionByid(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield TransactionRepo_1.readTransactionById(params);
        return [result, status];
    });
}
exports.readTransactionByid = readTransactionByid;
function savePdfToStorage(content, employee_id, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const { size, data } = content;
        if (size > 1024 * 1024)
            return false;
        const read = yield readPdfToText(data, employee_id);
        if (!read) {
            callback(false);
        }
        else {
            callback(true, read);
        }
    });
}
exports.savePdfToStorage = savePdfToStorage;
function readPdfToText(buffer, employee_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let dataText = yield pdf_parse_1.default(buffer, { version: 'default' });
            dataText = dataText.text.trim();
            console.log('DATA CLEANING ----');
            console.log(dataText);
            const salesDetail = [];
            const csv = [];
            const refOrder = dataText.split('\n')[1].split(': ')[1].split('Member')[0];
            const orderDate = dataText.split('\n')[2].split(' ')[2];
            let total = dataText.split('\n')[4].split(' ')[2];
            let sales = dataText
                .split('NoNamaQTYHargaSubtotalDiscountTotal')[1]
                .split('Subtotal')[0]
                .trim()
                .split('\n');
            console.log('---- SALES');
            console.log(sales);
            const removeTea = sales.findIndex((e) => e === 'TEA');
            if (removeTea !== -1) {
                sales[removeTea - 1] = sales[removeTea - 1].concat(sales[removeTea + 1]);
                sales.splice(removeTea, 2);
            }
            total = total.slice(0, total.length - 3).replace(/\./g, '');
            sales.forEach((e) => {
                const split = e.split('Rp.');
                const productName = split[0].slice(1, split[0].length - 1).trim();
                const quantity = split[0].slice(split[0].length - 1);
                const price = split[1].slice(0, split[1].length - 3).replace(/\./g, '');
                const subtotal = split[2].slice(0, split[2].length - 3).replace(/\./g, '');
                csv.push(productName.toUpperCase());
                salesDetail.push({
                    nama_produk: productName.toUpperCase(),
                    kuantiti: quantity,
                    price,
                    total_transaksi_detail: subtotal,
                });
            });
            // let commaCsv = ','.repeat(8 - csv.length);
            const [db, status] = yield createDataTransaction({
                id: orderDate.concat('-').concat(refOrder),
                date: orderDate,
                detail: salesDetail,
                total,
            }, employee_id);
            if (status) {
                // fs.appendFileSync(
                //   '/home/fadelfirmansyah/Documents/Lumos Final Project/lumos-api-ts/api/transaction/lumos.csv',
                //   csv.toString().toUpperCase() + commaCsv + '\n'
                // );
                return {
                    id: orderDate.concat('-').concat(refOrder),
                    date: orderDate,
                    detail: salesDetail,
                    total,
                };
            }
            else {
                return false;
            }
        }
        catch (err) {
            const read = readPdfToText(buffer, employee_id);
            console.log(err);
            return read;
        }
    });
}
