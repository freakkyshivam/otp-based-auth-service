import type { LucideIcon } from "lucide-react";
export interface User {
  id: string;
  name: string;
  email: string;
  isAccountVerified: boolean;
  isTwoFactorEnabled : boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceInfo {
  deviceType: string;
  deviceName: string;
  os: string;
  browser: string;
  ipAddress: string;
}

export interface LoginResponse {
  success: boolean;
  msg: string;
  user: User;
  accessToken?: string;  
  device?: DeviceInfo;   
}

export interface LoginSuccessResponse {
  success: true;
  msg: string;
  user: User;
  twoFactorEnabled? : boolean,
}

export interface LoginErrorResponse {
  success: false;
  msg: string;
}

export interface signupResponse {
  success: false;
  msg: string;
}

export interface APIResponse<T> {
  success: boolean;
  msg: string;
  data?: T;
}

export interface NormalApiResponse {
   success: boolean;
  msg: string;
  data ? : string[] 
}


export interface Session  {
  id: string;
  userId: string;
  refreshToken: string;
  deviceName: string;
  deviceType: string;
  os: string;
  browser: string;
  ipAddress: string;
  isActive: boolean;
  lastUsedAt: string;    
  createdAt: string;   
  revokedAt: string | null;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  isAccountVerified: boolean;
  is2fa: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}


export interface UserInfoData {
  user: ApiUser;           
  currentSession: Session;
  activeSessionCount: string;
}




export interface SidebarItem {
  title: string;
  icon: LucideIcon;
}
