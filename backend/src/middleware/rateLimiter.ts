import { NextFunction,Request, Response } from "express";
import {getRedis} from '../config/redis.js'

export const rateLimiter =
  ({ limit = 5, window = 60 }: { limit?: number; window?: number }) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redis = await getRedis();

      const ip =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
        req.socket.remoteAddress ||
        "unknown";

      const key = `rate:${ip}`;

      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, window);
      }

      if (current > limit) {
        return res.status(429).json({ error: "Too many requests" });
      }

      next();
    } catch (err) {
       
      next();
    }
  };
