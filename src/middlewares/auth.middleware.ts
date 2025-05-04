import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface IAuthRequest extends Request {
  user?: { id: string };
}

export const authMiddleware = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      user: { id: string };
    };
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
