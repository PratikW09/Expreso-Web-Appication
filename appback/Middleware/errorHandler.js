const errorHandler = (err, req, res, next) => {
    console.error(err.stack || err.message);
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    return res.status(statusCode).json({
      success: false,
      message,
      error: err.details || {},
    });
  };
  
  export default errorHandler;
  