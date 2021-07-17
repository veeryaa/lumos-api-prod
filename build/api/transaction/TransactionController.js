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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportCsvController = exports.listRecommendationController = exports.generateRecController = exports.claimController = exports.findByIdController = exports.readAllTransactionController = exports.trxByCustController = exports.pdfToTextController = void 0;
const fs = __importStar(require("fs"));
const TransactionService_1 = require("./TransactionService");
const TransactionRepo_1 = require("./TransactionRepo");
const child_process_1 = __importDefault(require("child_process"));
const enum_1 = require("../../helper/enum");
function exportCsvController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { tglawal, tglakhir } = req.body;
        const [result, status] = yield TransactionService_1.exportTrxToCsv(tglawal, tglakhir);
        if (status !== 'Error') {
            const csv = [];
            for (let i = 0; i < result.read.length; i++) {
                const fillCsv = [];
                result.read[i].TransactionDetail.forEach((produk) => fillCsv.push(produk.product.nama_produk));
                csv.push(fillCsv);
            }
            const data = csv.map((e) => {
                return e.toString() + ','.repeat(8 - e.length) + '\n';
            });
            fs.writeFileSync('/home/fadelfirmansyah/Documents/Lumos Final Project/lumos-api-prod/api/transaction/lumos.csv', data.join(''));
            res.status(200).json({
                status: 200,
                msg: enum_1.SUCCESS_MESSAGE.READ_ALL,
                count: result.count,
                result: result.read,
            });
        }
        else {
            res.status(500).json({
                status: 500,
                msg: enum_1.FAIL_MESSAGE.READ_ALL,
                result: null,
            });
        }
    });
}
exports.exportCsvController = exportCsvController;
function readAllTransactionController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = String(req.query.page);
        const [result, status] = yield TransactionService_1.readAllTransaction(page);
        if (status !== 'Error') {
            res.status(200).json({
                status: 200,
                msg: enum_1.SUCCESS_MESSAGE.READ_ALL,
                count: result.count,
                result: result.read,
            });
        }
        else {
            res.status(500).json({
                status: 500,
                msg: enum_1.FAIL_MESSAGE.READ_ALL,
                result: null,
            });
        }
    });
}
exports.readAllTransactionController = readAllTransactionController;
function findByIdController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield TransactionService_1.readTransactionByid(req.params.id);
        if (status !== 'Error') {
            res.status(200).json({
                status: 200,
                msg: enum_1.SUCCESS_MESSAGE.READ_ID,
                result: [result],
            });
        }
        else {
            res.status(500).json({
                status: 500,
                msg: enum_1.FAIL_MESSAGE.READ_ID,
                result: null,
            });
        }
    });
}
exports.findByIdController = findByIdController;
function generateRecController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { support, confidence, total_data, employee_id } = req.body;
        console.log(req.body);
        child_process_1.default.exec(`/home/fadelfirmansyah/Documents/"Lumos Final Project"/lumos-api-prod/api/transaction/job.sh ${support} ${confidence} ${total_data}`, { shell: '/bin/bash' }, (err, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
            if (stdout !== '') {
                const result = stdout.trimEnd();
                const finalResult = [];
                result.split('\n').forEach((val, i) => {
                    if (i !== 0) {
                        const value = val.trimEnd().replace(/\s+/g, ' ');
                        const innerValue = value.split('\n');
                        console.log(innerValue);
                        if (innerValue[0].toString().includes('Columns: [antecedents')) {
                            res.status(500).json({
                                status: 500,
                                code: 'no',
                                msg: 'Tidak ada rule yang dihasilkan.',
                                result: null,
                            });
                            return;
                        }
                        else {
                            innerValue.forEach((ival) => {
                                const value = ival.replace(/[(\\]/g, '').split(') ');
                                const valueScore = value[2].split(' ');
                                const antecedent = value[0].slice(2, value[0].length).split(',');
                                const consequent = value[1].split(',');
                                finalResult.push({
                                    antecedent,
                                    consequent,
                                    support: Number(valueScore[2]),
                                    confidence: Number(valueScore[3]),
                                    lift_ratio: Number(valueScore[4]),
                                    employee_id,
                                });
                            });
                        }
                    }
                });
                const recommendation = yield TransactionRepo_1.createDataRecommendation(finalResult);
                console.log(recommendation);
                res.status(200).json({
                    status: 200,
                    code: 'success',
                    msg: 'Model berhasil dibentuk.',
                    result: finalResult,
                });
            }
            else if (stderr !== '') {
                res.status(500).json({
                    status: 500,
                    code: 'error',
                    msg: 'Gagal untuk melakukan training data.',
                    result: null,
                });
            }
        }));
    });
}
exports.generateRecController = generateRecController;
function listRecommendationController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield TransactionService_1.getListRecommendation();
        if (status !== 'Error') {
            res.status(200).json({
                status: 200,
                msg: enum_1.SUCCESS_MESSAGE.READ_ALL,
                result,
            });
        }
        else {
            res.status(500).json({
                status: 500,
                msg: result,
                result: null,
            });
        }
    });
}
exports.listRecommendationController = listRecommendationController;
function trxByCustController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield TransactionService_1.readTransactionByCustomerId(req.params.cust);
        if (status !== 'Error') {
            res.status(200).json({
                status: 200,
                msg: enum_1.SUCCESS_MESSAGE.READ_ALL,
                result,
            });
        }
        else {
            res.status(500).json({
                status: 500,
                msg: result,
                result: null,
            });
        }
    });
}
exports.trxByCustController = trxByCustController;
function claimController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield TransactionService_1.claimTrxByCustomer(req.params.trx, String(req.body.cust_id));
        console.log(typeof req.body.cust_id);
        console.log('///');
        if (status !== 'Error') {
            res.status(200).json({
                status: 200,
                msg: 'Transaksi berhasil diklaim',
                result,
            });
        }
        else {
            res.status(500).json({
                status: 500,
                msg: result,
                result: null,
            });
        }
    });
}
exports.claimController = claimController;
function pdfToTextController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.files);
        console.log(req.body.id);
        if (!req.files) {
            res.send({
                status: 400,
                msg: 'File PDF tidak ditemukan.',
            });
        }
        else {
            try {
                yield TransactionService_1.savePdfToStorage(req.files.data, req.body.id, (response, result) => __awaiter(this, void 0, void 0, function* () {
                    const { name } = req.files.data;
                    if (!response) {
                        res.status(500).json({
                            status: 500,
                            msg: 'Server tidak dapat membaca file yang diberikan.',
                        });
                    }
                    else if (response) {
                        res.status(201).json({
                            status: 201,
                            metadata: {
                                name,
                            },
                            result,
                            msg: 'File telah berhasil diupload',
                        });
                    }
                }));
            }
            catch (err) {
                console.error('Controller Error');
            }
        }
    });
}
exports.pdfToTextController = pdfToTextController;
