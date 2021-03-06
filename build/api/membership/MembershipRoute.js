"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MembershipController_1 = require("./MembershipController");
const MembershipRoute = express_1.Router();
MembershipRoute.post('/create', MembershipController_1.createController);
MembershipRoute.get('/read', MembershipController_1.readAllController);
MembershipRoute.get('/find/:id', MembershipController_1.findByIdController);
MembershipRoute.put('/update/:id', MembershipController_1.updateController);
exports.default = MembershipRoute;
