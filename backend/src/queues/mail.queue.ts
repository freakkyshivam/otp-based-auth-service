import { Queue } from "bullmq";
import { bullRedis } from "../config/bullmq.redis.js";

export const mailQueue = new Queue('mail-queue',{
    connection:bullRedis,
    defaultJobOptions : {
        attempts : 3,
        backoff : {
            type : "exponential",
            delay : 2000,
        },
        removeOnComplete : true,
        removeOnFail : false
    },
})

  export const enqueueMail = async (
        type:   "WELCOME" | "RESET_PASSWORD" | "ACCOUNT_VERIFY" | "TWO_FACTOR_AUTH" | "PASSWORD_RESET_ALERT",
    payload: Record<string, any>
    )=>{
        await mailQueue.add(type,payload);
    }