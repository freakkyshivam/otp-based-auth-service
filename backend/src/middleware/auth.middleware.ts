import jwt, { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import UserSessions from "../db/schema/user_sessions.schema.js";
import db from '../db/db.js'
import { and, eq } from "drizzle-orm";
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.cookies?.accessToken;


    if (!token) {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }

      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET! as string
    ) as JwtPayload;
     

    if (!decoded) {
      return res.status(401).json({ success: false, msg: "Invalid token" });
    }

    const {sid} = decoded;

    if (!sid) {
  return res.status(401).json({
    success: false,
    msg: "Invalid token payload",
  });
}


    const [session] = await db.select()
    .from(UserSessions)
    .where(and(
      eq(UserSessions.id, sid),
      eq(UserSessions.isActive, true)
    ))

   if (!session || session.revokedAt) {
      return res.status(401).
      json({
        success:false,
        msg:"Session revoked"
      })
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    console.error(error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
