/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  console.error('Error:', err);
  
  // Set the status code
  const statusCode = err.statusCode || 500;
  
  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler }; 