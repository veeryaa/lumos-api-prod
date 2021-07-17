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
exports.updateCustomer = exports.findCustomerById = exports.readAllCustomerByMembership = exports.readAllCustomer = exports.createCustomer = void 0;
const CustomerRepo_1 = require("./CustomerRepo");
const bcrypt_1 = __importDefault(require("bcrypt"));
function createCustomer(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield bcrypt_1.default.hash(body.password, 10);
        const [result, status] = yield CustomerRepo_1.createCustomer(body, hash);
        return [result, status];
    });
}
exports.createCustomer = createCustomer;
function readAllCustomer(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const [{ read, count }, status] = yield CustomerRepo_1.readAllCustomer(page);
        return [{ read, count }, status];
    });
}
exports.readAllCustomer = readAllCustomer;
function readAllCustomerByMembership(membership, page) {
    return __awaiter(this, void 0, void 0, function* () {
        const [{ read, count }, status] = yield CustomerRepo_1.readAllCustomerByMembership(membership, page);
        console.log(read);
        return [{ read, count }, status];
    });
}
exports.readAllCustomerByMembership = readAllCustomerByMembership;
function findCustomerById(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield CustomerRepo_1.findCustomerById(params);
        return [result, status];
    });
}
exports.findCustomerById = findCustomerById;
function updateCustomer(params, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield CustomerRepo_1.updateCustomer(params, body);
        return [result, status];
    });
}
exports.updateCustomer = updateCustomer;
