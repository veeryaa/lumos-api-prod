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
exports.readAllByRole = exports.updateController = exports.readAllController = exports.findByIdController = exports.createController = void 0;
const enum_1 = require("../../helper/enum");
const EmployeeService_1 = require("./EmployeeService");
function createController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield EmployeeService_1.createEmployee(req.body);
        if (status !== 'Error') {
            res.status(201).json({
                status: 201,
                msg: enum_1.SUCCESS_MESSAGE.CREATE,
                result,
            });
        }
        else {
            res.status(500).json({
                status: 500,
                msg: status,
                result,
            });
        }
    });
}
exports.createController = createController;
function findByIdController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield EmployeeService_1.findEmployeeById(req.params.id);
        if (status !== 'Error') {
            console.log(result);
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
function readAllController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = String(req.query.page);
        const [result, status] = yield EmployeeService_1.readAllEmployee(page);
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
exports.readAllController = readAllController;
function readAllByRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { role } = req.params;
        const page = String(req.query.page);
        const [result, status] = yield EmployeeService_1.readAllEmployeeByRole(role, page);
        console.log('READ BY ROLE');
        if (status !== 'Error') {
            res.status(200).json({
                status: 200,
                msg: enum_1.SUCCESS_MESSAGE.READ_ALL,
                count: result.count,
                result: result.read
            });
        }
        else {
            res.status(500).json({
                status: 500,
                msg: enum_1.FAIL_MESSAGE.READ_ALL,
                result: null
            });
        }
    });
}
exports.readAllByRole = readAllByRole;
function updateController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield EmployeeService_1.updateEmployee(req.params.id, req.body);
        if (status !== 'Error') {
            res.status(200).json({
                status: 200,
                msg: enum_1.SUCCESS_MESSAGE.UPDATE,
                result,
            });
        }
        else {
            res.status(500).json({
                status: 500,
                msg: enum_1.FAIL_MESSAGE.UPDATE,
                result: null,
            });
        }
    });
}
exports.updateController = updateController;
