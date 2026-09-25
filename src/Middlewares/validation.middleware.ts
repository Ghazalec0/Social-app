//validation.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodObject,ZodIssue } from "zod";
import { BadRequestException } from "../common";


export const isValid = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync(req.body);
    if (result.success == false) {
      // prepare errors
      const errMessages = result.error.issues.map((issue) => ({
        path: issue.path[0] as string, // propertyKey >> "username"
        message: issue.message,
      }));
      throw new BadRequestException("validation error", errMessages);
    }

    next();
  };
};

export const isValidGQL = async (schema: ZodObject<any>, args: unknown): Promise<void> => {
  const result = await schema.safeParseAsync(args);
  
  if (!result.success) {
    // prepare errors
    const errMessages = result.error.issues.map((issue: ZodIssue) => ({
      path: issue.path[0] as string, // propertyKey >> "username"
      message: issue.message,
    }));
    
    throw new BadRequestException("validation error", errMessages);
  }
  return;
};