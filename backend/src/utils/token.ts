import jwt from "jsonwebtoken";

export const generateAccessToken = async (id:string, email: string,is2fa:boolean | null, sid:string)=>{
   try {
     const payload = {
        id,
        email,
        is2fa,
        sid
    }
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!,{expiresIn:"5m"})
    return token;
   } catch (error:any) {
    console.error(error.message)
    throw error;
   }
}

export const generateRefreshToken = async (id:string, email: string,is2fa:boolean | null)=>{
   try {
     const payload = {
        id,
        email,
        is2fa
    }
    const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!,{expiresIn:"7d"})
    return token;
   } catch (error:any) {
    console.error(error.message)
    throw error;
   }
}

export const verifyToken = (token:string)=>{
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!)
}