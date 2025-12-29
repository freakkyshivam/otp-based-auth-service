import { Worker } from "bullmq";
 import { bullRedis } from "../config/bullmq.redis.js";
 
import {
    sendWelcomeEmail,
  sendRegisterAccountVerifyEmail,
  sendPasswordRestEmail,
  sendPasswordRestAlertEmail,
  sendTwoFactorAuthEmail,
} from "../services/mail/mail.service.js";
 
new Worker('mail-queue',
    async (job)=>{
        const {name , data} = job;

        switch (name){

            case "WELCOME":
                await sendWelcomeEmail(
                    data.name,
                    data.email
                );
                break;

            case "REGISTER_VERIFY":
                await sendRegisterAccountVerifyEmail(
                    data.name,
                    data.email,
                    data.otp
                );
                break;

            case "PASSWORD_RESET":
                await sendPasswordRestEmail(
                    data.name,
                    data.email,
                    data.otp
                );
                break;

            case "PASSWORD_RESET_ALERT":
                await sendPasswordRestAlertEmail(
                    data.name,
                    data.email,
                );
                break;

            case "TWO_FACTOR_AUTH":
                await sendTwoFactorAuthEmail(
                    data.name,
                    data.email,
                    data.otp
                );
                break;

            default:
        throw new Error(`Unknown mail job: ${name}`);
        }
    
    },
    {
        connection : bullRedis,
        concurrency : 5
    }
)