import { NextFunction,Request, Response } from 'express'
import jwt,{JwtPayload} from 'jsonwebtoken'
export interface AuthRequest extends Request {
  user?: JwtPayload;
}
export const verifyTemptoken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tempToken = req.cookies?.tempToken;

    if (!tempToken) {
      return res
        .status(401)
        .json({ success: false, msg: "Temp token missing" });
    }

    const decoded = jwt.verify(
      tempToken,
      process.env.JWT_TEMP_TOKEN_SECRET!
    ) as JwtPayload;

    if (decoded.purpose !== "2fa") {
      return res
        .status(403)
        .json({ msg: "Invalid temp token purpose" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ msg: "Temp token expired or invalid" });
  }
};
