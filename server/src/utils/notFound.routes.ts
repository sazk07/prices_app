import { type NextFunction, type Request, type Response } from "express";
import { HttpError } from "@sazk/http-errors-enhanced";

const notFoundRouter = (_req: Request, _res: Response, next: NextFunction) => {
  const notFoundErr = new HttpError(404, "404 Not Found");
  next(notFoundErr);
};

export default notFoundRouter;
