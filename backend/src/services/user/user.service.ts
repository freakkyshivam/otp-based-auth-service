import { eq } from 'drizzle-orm'
import db from '../../db/db.js'
import Users from '../../db/schema/users.schema.js'


export const findUserByEmail = async (email :string)=>{
    
        if(!email){
            throw new Error("Email id is required")
        }
        const [user]= await db
        .select({
            id: Users.id,
          name: Users.name,
          email: Users.email,
          password : Users.password,
          isAccountVerified: Users.isAccountVerified,
          is2fa : Users.is2fa,
          twoFactorSecret : Users.twoFactorSecret,
          twoFactorNonce : Users.twoFactorNonce
        }).
        from(Users).
        where( eq(Users.email, email))
        .limit(1);
        return user ?? null;
     
}