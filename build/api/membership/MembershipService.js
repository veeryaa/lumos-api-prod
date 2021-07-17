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
exports.updateMembership = exports.readAllMembership = exports.findMembershipById = exports.createMembership = void 0;
const MembershipRepo_1 = require("./MembershipRepo");
function createMembership(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield MembershipRepo_1.createMembership(body);
        return [result, status];
    });
}
exports.createMembership = createMembership;
function findMembershipById(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield MembershipRepo_1.findMembershipById(params);
        return [result, status];
    });
}
exports.findMembershipById = findMembershipById;
function readAllMembership() {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield MembershipRepo_1.readAllMembership();
        return [result, status];
    });
}
exports.readAllMembership = readAllMembership;
function updateMembership(params, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const [result, status] = yield MembershipRepo_1.updateMembership(params, body);
        return [result, status];
    });
}
exports.updateMembership = updateMembership;
