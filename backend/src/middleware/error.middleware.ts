import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
    statusCode?: number;
    status?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';

    console.error(`[Error] ${statusCode} - ${err.message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        status,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export class ApiError extends Error {
    statusCode: number;
    status: string;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 500 ? 'error' : 'fail';
        Error.captureStackTrace(this, this.constructor);
    }
}

export default errorHandler;
