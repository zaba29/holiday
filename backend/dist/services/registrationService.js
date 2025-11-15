"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondMoreInfo = exports.requestMoreInfo = exports.rejectRegistration = exports.approveRegistration = exports.getRegistrationByToken = exports.createRegistration = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const token_1 = require("../utils/token");
const authService_1 = require("./authService");
const mailer_1 = require("../email/mailer");
const env_1 = require("../config/env");
const client_1 = require("@prisma/client");
const createRegistration = async (data) => {
    const passwordHash = await (0, authService_1.hashPassword)(data.password);
    const approvalToken = (0, token_1.generateToken)();
    const request = await prisma_1.default.registrationRequest.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            employeeNumber: data.employeeNumber,
            passwordHash,
            approvalToken,
        },
    });
    await (0, mailer_1.sendMail)({
        to: env_1.config.adminEmail,
        subject: 'New registration pending approval',
        html: `A new employee registration requires review.<br/><a href="${env_1.config.backendUrl}/admin/registrations/${approvalToken}">Open request</a>`,
    });
    return request;
};
exports.createRegistration = createRegistration;
const getRegistrationByToken = (token) => prisma_1.default.registrationRequest.findUnique({ where: { approvalToken: token }, include: { messages: true } });
exports.getRegistrationByToken = getRegistrationByToken;
const approveRegistration = async (token, allocation) => {
    const request = await prisma_1.default.registrationRequest.findUnique({ where: { approvalToken: token } });
    if (!request)
        throw new Error('Request not found');
    if (request.status !== client_1.RegistrationStatus.PENDING && request.status !== client_1.RegistrationStatus.MORE_INFO) {
        throw new Error('Request already processed');
    }
    const annualAllocation = allocation || env_1.config.defaultAnnualAllocation;
    const user = await prisma_1.default.user.create({
        data: {
            firstName: request.firstName,
            lastName: request.lastName,
            email: request.email,
            employeeNumber: request.employeeNumber,
            passwordHash: request.passwordHash,
            role: client_1.Role.EMPLOYEE,
            status: client_1.UserStatus.ACTIVE,
            annualAllocation,
            remainingDays: annualAllocation,
        },
    });
    await prisma_1.default.registrationRequest.update({
        where: { id: request.id },
        data: { status: client_1.RegistrationStatus.APPROVED },
    });
    await (0, mailer_1.sendMail)({
        to: request.email,
        subject: 'Registration approved',
        html: `Your access has been approved. You can login at ${env_1.config.appUrl}.`,
    });
    return user;
};
exports.approveRegistration = approveRegistration;
const rejectRegistration = async (token, reason) => {
    const request = await prisma_1.default.registrationRequest.update({
        where: { approvalToken: token },
        data: { status: client_1.RegistrationStatus.REJECTED, reason },
    });
    await (0, mailer_1.sendMail)({
        to: request.email,
        subject: 'Registration rejected',
        html: `Unfortunately your registration has been rejected.<br/>Reason: ${reason}`,
    });
    return request;
};
exports.rejectRegistration = rejectRegistration;
const requestMoreInfo = async (token, message) => {
    const infoToken = (0, token_1.generateToken)();
    const request = await prisma_1.default.registrationRequest.update({
        where: { approvalToken: token },
        data: { status: client_1.RegistrationStatus.MORE_INFO, adminMessage: message, infoToken },
    });
    await (0, mailer_1.sendMail)({
        to: request.email,
        subject: 'More information required',
        html: `${message}<br/><a href="${env_1.config.appUrl}/registration-response/${infoToken}">Provide details</a>`,
    });
    return request;
};
exports.requestMoreInfo = requestMoreInfo;
const respondMoreInfo = async (token, body) => {
    const request = await prisma_1.default.registrationRequest.findUnique({ where: { infoToken: token } });
    if (!request)
        throw new Error('Request not found');
    await prisma_1.default.registrationMessage.create({
        data: {
            requestId: request.id,
            senderRole: client_1.Role.EMPLOYEE,
            body,
        },
    });
    await (0, mailer_1.sendMail)({
        to: env_1.config.adminEmail,
        subject: 'Applicant responded to information request',
        html: `Review the update here: ${env_1.config.backendUrl}/admin/registrations/${request.approvalToken}`,
    });
};
exports.respondMoreInfo = respondMoreInfo;
