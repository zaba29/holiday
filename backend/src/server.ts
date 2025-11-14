import app from './app';
import { config } from './config/env';
import prisma from './prisma';
import { createInitialAdmin } from './services/authService';

const start = async () => {
  await createInitialAdmin();
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

start();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
