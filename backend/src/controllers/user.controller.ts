import type { Request, Response } from "express";
import { and, desc, eq,ne, sql } from "drizzle-orm";

import db from "../db/db.js";
import Users from "../db/schema/users.schema.js";
import { UserSessions } from "../db/schema/user_sessions.schema.js";

import argon2 from 'argon2'
import { changePasswordValiadtion,updateNameValidation } from "../validation/validation.js";

export const UserInfo = async (req: Request, res: Response) => {
  try {
    // #region region agent log
    console.log(`[USER INFO] IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    // #endregion
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const { sid } = req.cookies;

    if (!sid) {
      return res
        .status(400)
        .json({ success: false, msg: "Session id not found" });
    }

    const currentSession = await db.
    select()
    .from(UserSessions)
    .where(
      and(
        eq(UserSessions.id, sid),
        eq(UserSessions.userId, user.id),
        eq(UserSessions.isActive, true)
      )
    )
    .limit(1);

    if(!currentSession.length){
      return res
        .status(401)
        .json({ success: false, msg: "Invalid or expired session" });
    }

    const avtiveSessionCount = await db.
    select({
      count: sql<number>`count(*)`
    })
    .from(UserSessions)
    .where((
      and(
        eq(UserSessions.userId, user.id),
        eq(UserSessions.isActive, true)
      )
    ))

    const result = await db
      .select({
        id : Users.id,
        name : Users.name,
        email : Users.email,
        isAccountVerified : Users.isAccountVerified,
        is2fa : Users.is2fa,
        lastLoginAt : Users.lastLoginAt,
        createdAt : Users.createdAt,
        updatedAt : Users.updatedAt
      })
      .from(Users)
      .where(eq(Users.id, user.id))
      .limit(1);

    if (!result) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid or expired session" });
    }

    return res.status(200).json({
      success: true,
      data : {
        user: result[0],
      currentSession : currentSession[0],
      activeSessionCount :avtiveSessionCount[0].count
      }
      
    });
  } catch (error: any) {
    console.error("User info fetching error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};


export const allSessions = async (req: Request, res: Response) => {
  try {
    // #region region agent log
    console.log(`[ALL SESSIONS] IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    // #endregion
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const {sid} = req.cookies;

    if (!sid) {
      return res
        .status(400)
        .json({ success: false, msg: "Session id not found" });
    }

    const sessions = await db
      .select()
      .from(UserSessions)
      .orderBy(desc(UserSessions.createdAt))
      .where(
        and(
           eq(UserSessions.userId, user.id),
            eq(UserSessions.isActive, true)
        )
       );
       
       const currentSession = sessions.find(
        s=> s.id === sid
       )

       const otherSessions = sessions.filter(
  s => s.id !== sid
);

    return res.status(200).json({
      success: true,
     data: {
      currentSession,
      otherSessions
     },
    });
  } catch (error: any) {
    console.error("User session fetching error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    // #region region agent log
    console.log(`[CHANGE PASSWORD] IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    // #endregion
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const validationResult = await changePasswordValiadtion.safeParseAsync(
      req.body
    );

    if (validationResult.error) {
      return res
        .status(400)
        .json({
          success: false,
          msg: "Please enter valid details",
          error: validationResult.error,
        });
    }

    const { password, newPassword } = validationResult.data;

    if (!password) {
      return res
        .status(400)
        .json({ success: false, msg: "Password are required" });
    }

    const [existingUser] = await db
      .select()
      .from(Users)
      .where(eq(Users.id, user.id))
       
       

      if(!existingUser){
        return res.status(400).json({
          success:false,
          msg:"Something went wrong"
        })
      }

    const isValid = await argon2.verify(existingUser.password, password)

    if(!isValid){
      return res.status(400).json({
        success:false,
        msg:"Wrong password"
      })
    }
    const hashedPassword = await argon2.hash(newPassword);

    const [updatedUser] = await db
      .update(Users)
      .set({ password: hashedPassword })
      .where(eq(Users.email, user?.email))
      .returning();

    return res
      .status(200)
      .json({ success: true, msg: "Password upadated successfully 123" });
  } catch (error: any) {
    console.error("Server error ", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

 

export const updateProfile = async (req:Request, res:Response)=>{
  try {
    // #region region agent log
    console.log(`[UPDATE PROFILE] IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    // #endregion
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const validationResult = await updateNameValidation.safeParseAsync(
      req.body
    );

    if (validationResult.error) {
      return res
        .status(400)
        .json({
          success: false,
          msg: "Please enter valid details",
          error: validationResult.error,
        });
    }

    const { name } = validationResult.data;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, msg: "Name is required" });
    }

    const [updatedUser] = await db
      .update(Users)
      .set({
        name: name,
        updatedAt: new Date()
      })
      .where(eq(Users.id, user.id))
      .returning({
        id: Users.id,
        name: Users.name,
        email: Users.email,
        isAccountVerified: Users.isAccountVerified,
        is2fa: Users.is2fa,
        lastLoginAt: Users.lastLoginAt,
        createdAt: Users.createdAt,
        updatedAt: Users.updatedAt
      });

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        msg: "Failed to update profile"
      });
    }

    return res
      .status(200)
      .json({
        success: true,
        msg: "Profile updated successfully",
        data: updatedUser
      });
  } catch (error: any) {
    console.error("Update profile error ", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
}