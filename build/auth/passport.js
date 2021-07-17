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
exports.passport = void 0;
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require(".prisma/client");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const employeeOpt = {
    secretOrKey: process.env.EMPLOYEE_TOKEN,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const customerOpt = {
    secretOrKey: process.env.CUSTOMER_TOKEN,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const localOptions = {
    passReqToCallback: true,
};
passport_1.default.use('employeeJwt', new passport_jwt_1.Strategy(employeeOpt, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    const email = yield prisma.employee.findUnique({
        where: { email: payload.username },
    });
    if (email === null)
        return done(null, false);
    if (email)
        return done(null, payload.username);
})));
passport_1.default.use('customerJwt', new passport_jwt_1.Strategy(customerOpt, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    const handphone = yield prisma.customerAccount.findUnique({
        where: { handphone: payload.username },
    });
    if (handphone === null)
        return done(null, false);
    if (handphone)
        return done(null, payload.username);
})));
passport_1.default.use('customerAuth', new passport_local_1.Strategy(localOptions, (req, username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Tryinggg');
        console.log(username);
        console.log(password);
        const user = yield prisma.customerAccount.findUnique({
            where: {
                handphone: username,
            },
            select: {
                customer_id: true,
                handphone: true,
                password: true,
                customer: {
                    select: {
                        nama: true,
                    },
                },
            },
        });
        console.log(user);
        const decrypt = yield bcrypt_1.default.compare(password, user.password);
        if (!decrypt)
            return done(null, false);
        if (user == null)
            return done(null, false);
        if (user && decrypt)
            return done(null, user);
    }
    catch (err) {
        req.isAuth = false;
        return done(null, false);
    }
})));
passport_1.default.use('employeeAuth', new passport_local_1.Strategy(localOptions, (req, username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.employee.findUnique({
            where: { email: username },
            select: {
                employee_id: true,
                email: true,
                password: true,
                role: true,
            },
        });
        const decrypt = yield bcrypt_1.default.compare(password, user.password);
        if (!decrypt)
            return done(null, false);
        if (user === null)
            return done(null, false);
        if (user && decrypt)
            return done(null, user);
    }
    catch (err) {
        console.log(err);
        req.isAuth = false;
        return done(null, false);
    }
})));
