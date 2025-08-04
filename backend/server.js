import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import beneficiaryRoutes from './routes/beneficiaryRoutes.js';
import fundRoutes from './routes/fundRoutes.js';
import surveyRoutes from './routes/surveyRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';

dotenv.config();

// Debug: Check if environment variables are loaded
console.log('🔧 Environment Variables Debug:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/integrations', integrationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'HEVA Cultural Inclusion API is running',
    version: '4.0.0',
    features: [
      'Role-based access control',
      'Advanced analytics & reporting',
      'Mobile optimization',
      'External API integrations',
      'Data export capabilities',
      'Real-time monitoring'
    ],
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 HEVA Cultural Inclusion API v4.0.0 ready`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📱 Mobile optimized with offline capabilities`);
  console.log(`🔗 External integrations enabled`);
});
