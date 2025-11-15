"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const userService_1 = require("../services/userService");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, (0, auth_1.authorize)([client_1.Role.ADMIN]), async (_req, res) => {
    const users = await (0, userService_1.listUsers)();
    res.json(users);
});
router.patch('/:id', auth_1.authenticate, (0, auth_1.authorize)([client_1.Role.ADMIN]), async (req, res) => {
    const user = await (0, userService_1.updateUser)(parseInt(req.params.id, 10), req.body);
    res.json(user);
});
exports.default = router;
