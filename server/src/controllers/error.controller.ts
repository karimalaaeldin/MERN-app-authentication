import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

const handleCastErrorDB = (error: any): AppError => {
  const message = `Invalid ${error.path}:${error.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (error: any): AppError => {
  const value = Object.values(error.keyValue).join(", ");
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (error: any): AppError => {
  const errors = Object.values(error.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (error: AppError, res: Response) => {
  res.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error: AppError, res: Response) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === "production") {
    let err = { ...error };
    if (error.name === "CastError") err = handleCastErrorDB(error);
    if (error.code === 11000) err = handleDuplicateFieldDB(error);
    if (error._message === "Validation failed")
      err = handleValidationErrorDB(error);

    sendErrorProd(err as AppError, res);
  }
};

export default globalErrorHandler;
