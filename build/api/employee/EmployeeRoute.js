"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EmployeeController_1 = require("./EmployeeController");
const EmployeeRoute = express_1.Router();
EmployeeRoute.post('/create', EmployeeController_1.createController);
EmployeeRoute.get('/read', EmployeeController_1.readAllController);
EmployeeRoute.get('/read/:role', EmployeeController_1.readAllByRole);
EmployeeRoute.get('/find/:id', EmployeeController_1.findByIdController);
EmployeeRoute.put('/update/:id', EmployeeController_1.updateController);
exports.default = EmployeeRoute;
