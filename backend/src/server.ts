import app from './app';
import { config } from './config/env';
import prisma from './prisma';
import { ensureSystemSettings } from './services/systemService';

const start = async () => {
  await ensureSystemSettings();
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

start();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
