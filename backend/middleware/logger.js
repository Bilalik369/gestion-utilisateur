import UserLog from '../models/UserLog.js';

// Log API requests
export const logRequest = (req, res, next) => {
  const start = Date.now();
  
  // Log when response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

// Log user actions
export const logUserAction = async (userId, action, details, req) => {
  try {
    await UserLog.create({
      userId,
      action,
      details,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
  } catch (error) {
    console.error('Error logging user action:', error);
  }
};