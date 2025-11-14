"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const prisma_1 = __importDefault(require("./prisma"));
const authService_1 = require("./services/authService");
const start = async () => {
    await (0, authService_1.createInitialAdmin)();
    app_1.default.listen(env_1.config.port, () => {
        console.log(`Server running on port ${env_1.config.port}`);
    });
};
start();
process.on('SIGINT', async () => {
    await prisma_1.default.$disconnect();
    process.exit(0);
});
