import { NextFunction,Request, Response } from 'express'
import jwt,{JwtPayload} from 'jsonwebtoken'
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const verifyTemptoken = async (req:Request, res:Response, next:NextFunction)=>{
    try {

        const {tempToken} = req.cookies || req.headers['authorization']?.split(" ")[1];

        if(!tempToken){
            return res.status(401).json({success:false, msg:"Temp token is missing"})
        }

        const decoded = jwt.verify(tempToken,process.env.JWT_TEMP_TOKEN_SECRET!) as JwtPayload

        if (decoded?.purpose !== "2fa") {
      return res.status(403).json({ msg: "Invalid temp token" });
    }

    req.user = decoded;
    next();
        
    } catch (error) {
        console.error("Temptoken verification error",error)
       return res.status(401).json({ msg: "Temp token expired or invalid" });
    }
}