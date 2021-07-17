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
exports.readAllEmployeeByRole = exports.updateEmployee = exports.readAllEmployee = exports.findEmployeeById = exports.createEmployee = void 0;
const client_1 = require(".prisma/client");
const prisma = new client_1.PrismaClient({ rejectOnNotFound: true });
function createEmployee(body, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { employee_id, nama, tanggal_lahir, email, role } = body;
            const employee = {
                employee_id,
                nama,
                tanggal_lahir: new Date(tanggal_lahir),
                email,
                password: hash,
                role,
            };
            const insert = yield prisma.employee.create({
                data: employee,
                select: {
                    employee_id: true,
                    nama: true,
                    tanggal_lahir: true,
                    email: true,
                    role: true,
                },
            });
            return [insert, true];
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.createEmployee = createEmployee;
function findEmployeeById(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const read = yield prisma.employee.findUnique({
                select: {
                    employee_id: true,
                    nama: true,
                    tanggal_lahir: true,
                    email: true,
                    role: true,
                },
                where: { employee_id: params },
            });
            return [read, true];
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.findEmployeeById = findEmployeeById;
function readAllEmployee(page) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const readCount = yield prisma.employee.count();
            if (Number(page) > 0) {
                const read = yield prisma.employee.findMany({
                    select: {
                        employee_id: true,
                        nama: true,
                        tanggal_lahir: true,
                        email: true,
                        role: true,
                    },
                    skip: Number(page) * 10 - 10,
                    take: 10,
                });
                return [{ read, count: readCount }, true];
            }
            else {
                const read = yield prisma.employee.findMany({
                    select: {
                        employee_id: true,
                        nama: true,
                        tanggal_lahir: true,
                        email: true,
                        role: true,
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
exports.readAllEmployee = readAllEmployee;
function readAllEmployeeByRole(role, page) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const readCount = yield prisma.employee.count({
                where: { role },
            });
            if (Number(page) > 0) {
                const read = yield prisma.employee.findMany({
                    where: {
                        role,
                    },
                    skip: Number(page) * 10 - 10,
                    take: 10,
                    select: {
                        employee_id: true,
                        nama: true,
                        tanggal_lahir: true,
                        email: true,
                        role: true,
                    },
                });
                return [{ read, count: readCount }, true];
            }
            else {
                const read = yield prisma.employee.findMany({
                    where: { role },
                    select: {
                        employee_id: true,
                        nama: true,
                        tanggal_lahir: true,
                        email: true,
                        role: true,
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
exports.readAllEmployeeByRole = readAllEmployeeByRole;
function updateEmployee(params, body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { nama, tanggal_lahir, email, role } = body;
            const employee = {
                nama,
                tanggal_lahir: new Date(tanggal_lahir),
                email,
                role,
            };
            const update = yield prisma.employee.update({
                where: {
                    employee_id: params,
                },
                select: {
                    employee_id: true,
                    nama: true,
                    tanggal_lahir: true,
                    email: true,
                    role: true,
                },
                data: employee,
            });
            return [update, true];
        }
        catch (err) {
            return [err, 'Error'];
        }
    });
}
exports.updateEmployee = updateEmployee;
