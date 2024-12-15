import { z, ZodError, ZodTypeAny } from "zod";
import { Request } from "express";

export const validateRequest = async <T extends ZodTypeAny>(
  req: Request,
  schema: T,
): Promise<z.infer<T>> => {
  try {
    const { body } = req;
    const result = await schema.parseAsync(body);
    return result;
  } catch (err) {
    if (err instanceof ZodError) {
      throw err;
    }
    throw new Error("Validation failed");
  }
};

export const validateId = async <T extends ZodTypeAny>(
  req: Request,
  schema: T,
): Promise<z.infer<T>> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Validation failed");
    }
    const idNumber = parseInt(id);
    const result = await schema.parseAsync(idNumber);
    return result;
  } catch (err) {
    if (err instanceof ZodError) {
      throw err;
    }
    throw new Error("Validation failed");
  }
};
