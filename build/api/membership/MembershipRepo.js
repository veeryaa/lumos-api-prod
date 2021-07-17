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
const client_1 = require(".prisma/client");
const prisma = new client_1.PrismaClient({ rejectOnNotFound: true });
function createMembership(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { membership_id, deskripsi, minimum_poin } = body;
            const membership = {
                membership_id,
                deskripsi,
                minimum_poin: Number(minimum_poin),
            };
            const insert = yield prisma.membership.create({
                data: membership,
            });
            return [insert, true];
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.createMembership = createMembership;
function findMembershipById(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const read = yield prisma.membership.findUnique({
                where: { membership_id: params },
            });
            return [read, true];
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.findMembershipById = findMembershipById;
function readAllMembership() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const read = yield prisma.membership.findMany();
            return [read, true];
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.readAllMembership = readAllMembership;
function updateMembership(params, body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { deskripsi, minimum_poin } = body;
            const membership = {
                deskripsi,
                minimum_poin: Number(minimum_poin),
            };
            const update = yield prisma.membership.update({
                where: {
                    membership_id: params,
                },
                data: membership,
            });
            return [update, true];
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.updateMembership = updateMembership;
