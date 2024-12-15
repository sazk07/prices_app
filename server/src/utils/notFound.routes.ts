import { NextFunction, Request, Response } from "express";
import { HttpError } from "./http-errors-enhanced/base.js";

const notFoundRouter = (_req: Request, _res: Response, next: NextFunction) => {
  const notFoundErr = new HttpError(404, "404 Not Found");
  next(notFoundErr);
};

export default notFoundRouter;
