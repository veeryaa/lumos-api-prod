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
exports.authRouter = void 0;
const express_1 = require("express");
const passport_1 = require("./passport");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require(".prisma/client");
dotenv_1.default.config();
const authRouter = express_1.Router();
exports.authRouter = authRouter;
const prisma = new client_1.PrismaClient();
const authOptions = {
    session: false,
    failWithError: true,
};
const verifyJwtToken = (auth, type) => __awaiter(void 0, void 0, void 0, function* () {
    if (type === 'employee') {
        const user = yield prisma.employee.findUnique({
            where: { email: auth },
        });
        if (user === null)
            return false;
        return true;
    }
    if (type === 'customer') {
        const user = yield prisma.customerAccount.findUnique({
            where: { handphone: auth },
        });
        if (user === null)
            return false;
        return true;
    }
});
// EMPLOYEE
authRouter.post('/login', passport_1.passport.authenticate('employeeAuth', authOptions), (req, res) => {
    const token = jsonwebtoken_1.default.sign({ employee_id: req.user.employee_id, username: req.body.username, role: req.user.role }, process.env.EMPLOYEE_TOKEN);
    res.status(200).json({
        status: 200,
        msg: 'Login sukses.',
        employee_id: req.user.employee_id,
        email: req.user.email,
        role: req.user.role,
        token: token,
    });
}, (err, req, res, next) => {
    if (!req.isAuth) {
        res.status(401).json({
            status: 401,
            msg: 'Login gagal.',
        });
    }
});
// CUSTOMER
authRouter.post('/customer', passport_1.passport.authenticate('customerAuth', authOptions), (req, res) => {
    const token = jsonwebtoken_1.default.sign({ customer_id: req.user.customer_id, username: req.body.username }, process.env.CUSTOMER_TOKEN);
    console.log(token);
    res.status(200).json({
        status: 200,
        msg: 'Login sukses.',
        customer_id: req.user.customer_id,
        handphone: req.body.username,
        token: token,
    });
}, (err, req, res, next) => {
    if (!req.isAuth) {
        console.log(err);
        res.status(401).json({
            status: 401,
            msg: 'Login gagal.',
        });
    }
});
authRouter.post('/verifyToken', (req, res) => {
    const { token } = req.body;
    jsonwebtoken_1.default.verify(token, process.env.EMPLOYEE_TOKEN, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.status(401).json({
                status: 401,
                msg: 'Token tidak dapat diverifikasi.',
            });
        }
        else {
            const isJwtExist = yield verifyJwtToken(payload.username, 'employee');
            console.log(payload);
            if (isJwtExist) {
                res.status(200).json({
                    status: 200,
                    msg: 'Token berhasil diverifikasi.',
                    token,
                    employee_id: payload.employee_id,
                    role: payload.role,
                    email: payload.username,
                });
            }
            else {
                res.status(401).json({
                    status: 401,
                    msg: 'Token tidak valid, dan user tidak terdaftar.',
                });
            }
        }
    }));
});
authRouter.post('/verifyCustomer', (req, res) => {
    const { token } = req.body;
    jsonwebtoken_1.default.verify(token, process.env.CUSTOMER_TOKEN, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.status(401).json({
                status: 401,
                msg: 'Token tidak dapat diverifikasi.',
            });
        }
        else {
            const isJwtExist = yield verifyJwtToken(payload.username, 'customer');
            console.log(payload);
            if (isJwtExist) {
                res.status(200).json({
                    status: 200,
                    msg: 'Token berhasil diverifikasi.',
                    token,
                    customer_id: payload.customer_id,
                    handphone: payload.username,
                });
            }
            else {
                res.status(401).json({
                    status: 401,
                    msg: 'Token tidak valid, dan user tidak terdaftar.',
                });
            }
        }
    }));
});
