import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db';
import authRouter from './routes/auth';
import shipsRouter from './routes/ships';
import maintenanceRouter from './routes/maintenance';
import drillsRouter from './routes/drills';
import dashboardRouter from './routes/dashboard';

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/auth', authRouter);
app.use('/api/ships', shipsRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/drills', drillsRouter);
app.use('/api/dashboard', dashboardRouter);

const PORT = process.env.PORT || 5000;

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/dist', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;