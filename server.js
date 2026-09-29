require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db/db.js');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require('path');
const fs = require('fs');

// API Welcome & Health Route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Job Portal Web Application REST API is active',
    version: '1.0.0',
    documentation: {
      auth: '/api/auth',
      users: '/api/users',
      jobs: '/api/jobs',
      applications: '/api/applications',
      admin: '/api/admin'
    }
  });
});

// Import route modules
const authRoutes = require('./routes/auth.routes.js');
const userRoutes = require('./routes/user.routes.js');
const jobRoutes = require('./routes/job.routes.js');
const applicationRoutes = require('./routes/application.routes.js');
const adminRoutes = require('./routes/admin.routes.js');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

// Serve Frontend production build if present
const frontendBuildPath = path.join(__dirname, '../frontend/build');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.redirect('/api');
  });
}

// 404 Handler for API endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Internal Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// Start database and start listening
db.initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  Job Portal Backend REST API Server`);
    console.log(`  Listening on: http://localhost:${PORT}`);
    console.log(`  Health check: http://localhost:${PORT}/`);
    console.log(`=======================================================`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
