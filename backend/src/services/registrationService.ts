import prisma from '../prisma';
import { generateToken } from '../utils/token';
import { hashPassword } from './authService';
import { sendMail } from '../email/mailer';
import { config } from '../config/env';
import { RegistrationStatus, Role, UserStatus } from '@prisma/client';

export const createRegistration = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  employeeNumber: string;
  password: string;
}) => {
  const passwordHash = await hashPassword(data.password);
  const approvalToken = generateToken();
  const request = await prisma.registrationRequest.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      employeeNumber: data.employeeNumber,
      passwordHash,
      approvalToken,
    },
  });

  await sendMail({
    to: config.adminEmail,
    subject: 'New registration pending approval',
    html: `A new employee registration requires review.<br/><a href="${config.backendUrl}/admin/registrations/${approvalToken}">Open request</a>`,
  });
  return request;
};

export const getRegistrationByToken = (token: string) =>
  prisma.registrationRequest.findUnique({ where: { approvalToken: token }, include: { messages: true } });

export const approveRegistration = async (token: string, allocation?: number) => {
  const request = await prisma.registrationRequest.findUnique({ where: { approvalToken: token } });
  if (!request) throw new Error('Request not found');
  if (request.status !== RegistrationStatus.PENDING && request.status !== RegistrationStatus.MORE_INFO) {
    throw new Error('Request already processed');
  }
  const annualAllocation = allocation || config.defaultAnnualAllocation;
  const user = await prisma.user.create({
    data: {
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      employeeNumber: request.employeeNumber,
      passwordHash: request.passwordHash,
      role: Role.EMPLOYEE,
      status: UserStatus.ACTIVE,
      annualAllocation,
      remainingDays: annualAllocation,
    },
  });
  await prisma.registrationRequest.update({
    where: { id: request.id },
    data: { status: RegistrationStatus.APPROVED },
  });
  await sendMail({
    to: request.email,
    subject: 'Registration approved',
    html: `Your access has been approved. You can login at ${config.appUrl}.`,
  });
  return user;
};

export const rejectRegistration = async (token: string, reason: string) => {
  const request = await prisma.registrationRequest.update({
    where: { approvalToken: token },
    data: { status: RegistrationStatus.REJECTED, reason },
  });
  await sendMail({
    to: request.email,
    subject: 'Registration rejected',
    html: `Unfortunately your registration has been rejected.<br/>Reason: ${reason}`,
  });
  return request;
};

export const requestMoreInfo = async (token: string, message: string) => {
  const infoToken = generateToken();
  const request = await prisma.registrationRequest.update({
    where: { approvalToken: token },
    data: { status: RegistrationStatus.MORE_INFO, adminMessage: message, infoToken },
  });
  await sendMail({
    to: request.email,
    subject: 'More information required',
    html: `${message}<br/><a href="${config.appUrl}/registration-response/${infoToken}">Provide details</a>`,
  });
  return request;
};

export const respondMoreInfo = async (token: string, body: string) => {
  const request = await prisma.registrationRequest.findUnique({ where: { infoToken: token } });
  if (!request) throw new Error('Request not found');
  await prisma.registrationMessage.create({
    data: {
      requestId: request.id,
      senderRole: Role.EMPLOYEE,
      body,
    },
  });
  await sendMail({
    to: config.adminEmail,
    subject: 'Applicant responded to information request',
    html: `Review the update here: ${config.backendUrl}/admin/registrations/${request.approvalToken}`,
  });
};
