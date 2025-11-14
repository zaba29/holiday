import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import { config } from './config/env';
import authRoutes from './routes/authRoutes';
import registrationRoutes from './routes/registrationRoutes';
import leaveRoutes from './routes/leaveRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.appUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== 'test') {
  app.use(csrf({ cookie: true }));
}

app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

export default app;
