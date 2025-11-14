"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondInfo = exports.askInfo = exports.reject = exports.approve = exports.showRegistration = exports.register = void 0;
const registrationService_1 = require("../services/registrationService");
const register = async (req, res) => {
    const request = await (0, registrationService_1.createRegistration)(req.body);
    res.status(201).json({ id: request.id });
};
exports.register = register;
const showRegistration = async (req, res) => {
    const token = req.params.token;
    const request = await (0, registrationService_1.getRegistrationByToken)(token);
    if (!request)
        return res.status(404).json({ message: 'Not found' });
    res.json(request);
};
exports.showRegistration = showRegistration;
const approve = async (req, res) => {
    const user = await (0, registrationService_1.approveRegistration)(req.params.token, req.body.allocation);
    res.json(user);
};
exports.approve = approve;
const reject = async (req, res) => {
    if (!req.body.reason)
        return res.status(400).json({ message: 'Reason required' });
    const request = await (0, registrationService_1.rejectRegistration)(req.params.token, req.body.reason);
    res.json(request);
};
exports.reject = reject;
const askInfo = async (req, res) => {
    if (!req.body.message)
        return res.status(400).json({ message: 'Message required' });
    const request = await (0, registrationService_1.requestMoreInfo)(req.params.token, req.body.message);
    res.json(request);
};
exports.askInfo = askInfo;
const respondInfo = async (req, res) => {
    if (!req.body.message)
        return res.status(400).json({ message: 'Message required' });
    await (0, registrationService_1.respondMoreInfo)(req.params.token, req.body.message);
    res.json({ ok: true });
};
exports.respondInfo = respondInfo;
