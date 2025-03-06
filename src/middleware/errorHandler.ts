import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/Logger';

class ErrorHandler {
  public static handleError(err: Error, req: Request, res: Response, next: NextFunction): void {
    Logger.error('Unhandled error occurred', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
}

export default ErrorHandler.handleError;
