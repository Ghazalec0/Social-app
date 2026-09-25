import { Request, Response, NextFunction } from "express";
import { BadRequestException, UnAuthorizedException } from "../common";
import { JwtPayload, verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from '../config';
import jwt from "jsonwebtoken";
export const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    const authorization = req.headers.authorization;

    if (!authorization) {
        throw new BadRequestException("token is required");
    }

    const token = authorization.split(" ")[1];

    if (!token) {
        throw new BadRequestException("token is required");
    }

    try {
        req.user = jwt.verify(
            token,
            ACCESS_TOKEN_SECRET
        ) as any;

        next();
    } catch (error) {
        throw new UnAuthorizedException(
            "invalid or expired token"
        );
    }
};


export const isAuthGQL = (context: any): void => {
  const authorization: any = context.headers.authorization;
  const token: any = authorization?.split(' ')[1];
  if (!token) throw new BadRequestException('token is required');

  context.payload = verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
  return;
}