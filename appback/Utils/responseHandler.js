export const Response = (res,statusCode, message, data = {}) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };
  
export const errorResponse = (res, statusCode, message, error = {}) => {
    return res.status(statusCode).json({
      success: false,
      message,
      error,
    });
  };