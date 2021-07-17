"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const routes_1 = __importDefault(require("./api/routes"));
const auth_1 = require("./auth/auth");
dotenv_1.default.config();
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(passport_1.default.initialize());
app.use(express_fileupload_1.default());
app.use('/auth', auth_1.authRouter);
app.use('/api', routes_1.default);
app.listen(process.env.PORT, () => {
    console.log(`It's running! PORT: ${process.env.PORT}`);
});
