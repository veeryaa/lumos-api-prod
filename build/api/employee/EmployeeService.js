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
exports.readAllEmployeeByRole = exports.updateEmployee = exports.readAllEmployee = exports.findEmployeeById = exports.createEmployee = void 0;
const EmployeeRepo_1 = require("./EmployeeRepo");
const bcrypt_1 = __importDefault(require("bcrypt"));
function createEmployee(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield bcrypt_1.default.hash(body.password, 10);
        const [result, status] = yield EmployeeRepo_1.createEmployee(body, hash);
        return [result, status];
    });
}
exports.createEmployee = createEmployee;
function findEmployeeById(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield EmployeeRepo_1.findEmployeeById(params);
        return [result, status];
    });
}
exports.findEmployeeById = findEmployeeById;
function readAllEmployee(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const [{ read, count }, status] = yield EmployeeRepo_1.readAllEmployee(page);
        return [{ read, count }, status];
    });
}
exports.readAllEmployee = readAllEmployee;
function readAllEmployeeByRole(role, page) {
    return __awaiter(this, void 0, void 0, function* () {
        const [{ read, count }, status] = yield EmployeeRepo_1.readAllEmployeeByRole(role, page);
        return [{ read, count }, status];
    });
}
exports.readAllEmployeeByRole = readAllEmployeeByRole;
function updateEmployee(params, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield EmployeeRepo_1.updateEmployee(params, body);
        return [result, status];
    });
}
exports.updateEmployee = updateEmployee;
