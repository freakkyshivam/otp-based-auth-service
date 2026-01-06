import { UserInfoApi } from "@/api/userApi";
import type { Session, User } from "@/types/types";
import { mapApiUserToUser } from "./mapApiUserToUser";

export const fetchUser = async (
  setUser: (user: User) => void,
  setCurrentSession : (currentSession : Session) => void,
  setActiveSessionCount : (activeSession : number) => void
): Promise<boolean> => {
  const res = await UserInfoApi();

  if (!res.success || !res.data) {
    console.log(res.msg);
    
    return false;
  }

 const user = mapApiUserToUser(res.data.user);
  
setUser(user);
localStorage.setItem("user", JSON.stringify(user));
setCurrentSession(res.data.currentSession);
localStorage.setItem("currentSession", JSON.stringify(res.data.currentSession));
setActiveSessionCount(Number(res.data.activeSessionCount));
localStorage.setItem("activeSessionCount", res.data.activeSessionCount);
  return true;
};
