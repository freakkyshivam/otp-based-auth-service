import { response, type Request, type Response } from "express";
import argon2 from "argon2";
import { and, eq, ne } from "drizzle-orm";

import db from "../../db/db.js";

import { UserSessions } from "../../db/schema/user_sessions.schema.js";

export const terminateAllOtherDevice = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const { refreshToken, sid } = req.cookies;

    if (!sid || !refreshToken) {
      return res.status(400).json({ success: false, msg: "Session not found" });
    }

    if (sid && refreshToken) {
      const [activeSession] = await db
        .select()
        .from(UserSessions)
        .where(
          and(
            eq(UserSessions.id, sid),
            eq(UserSessions.userId, user.id),
            eq(UserSessions.isActive, true)
          )
        );

      if (!activeSession) {
        return res.status(401).json({
          success: false,
          msg: "Invalid or expired session",
        });
      }

      const isValid = await argon2.verify(
        activeSession.refreshToken,
        refreshToken
      );

      if (isValid) {
        await db
          .update(UserSessions)
          .set({
            isActive: false,
            revokedAt: new Date(),
          })
          .where(
            and(
              eq(UserSessions.userId, user.id),
              ne(UserSessions.id, sid),
              eq(UserSessions.isActive, true)
            )
          );
      }
    }

    return res.status(200).json({
      success: true,
      message: "All other devices logged out successfully",
    });
  } catch (error: any) {
    console.error("Terminate devices error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

export const revokeSession = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({ success: false, msg: "Unautohrized" });
    }
    const { sid } = req.body || req.params;

    if (!sid) {
      return res
        .status(400)
        .json({ succes: false, msg: "Session id is required" });
    }

    await db
      .update(UserSessions)
      .set({
        isActive: false,
        revokedAt: new Date(),
      })
      .where(
        and(
          eq(UserSessions.id, sid),
          eq(UserSessions.userId, user.id),
          eq(UserSessions.isActive, true)
        )
      );

    return res.status(200).json({ success: true, msg: "Session revoked" });
  } catch (error: any) {
    console.error("Revoke session error error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};
