import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const logError: ErrorRequestHandler = (err, req, _res, next) => {
  req.app.get("env") === "development" ? console.error(err.stack) : "";
  next(err);
};

export const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // set locals, only providing error in development
  res.locals["message"] = err.message;
  res.locals["error"] = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({
    error:
      err instanceof Error
        ? err.message
        : Array.isArray(err)
          ? err
          : String(err),
  });
};
