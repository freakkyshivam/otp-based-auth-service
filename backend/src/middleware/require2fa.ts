 
import { NextFunction,Request, Response } from "express";

export const require2fEnabled = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        
  } catch (error : any) {
        console.log("Internal server error ", error.message);
        
        return res.status(500).json({
            success : false,
            msg : `Internal serevr error ${error.message}`
        })
    }
}