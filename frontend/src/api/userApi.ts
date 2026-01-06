 import type { APIResponse, Session, UserInfoData } from '@/types/types';
 import {AxiosError} from 'axios'
 import { api } from './authApi';
 export interface SessionsResponse {
  currentSession: Session;
  otherSessions: Session[];
}


export const UserInfoApi = async ():Promise<APIResponse<UserInfoData>>=>{
  try {
    const {data} = await api.get('/api/user/me')
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data as APIResponse<UserInfoData>;
    }

    return {
      success: false,
      msg: "Something went wrong",
      data: undefined,
    };
  }
}

 

export const allSessions = async (): Promise<APIResponse<SessionsResponse>> => {
  try {
    const { data } = await api.get<APIResponse<SessionsResponse>>(
      "/api/user/sessions",
      { withCredentials: true }
    );
 
    
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data as APIResponse<SessionsResponse>;
    }

    return {
      success: false,
      msg: "Something went wrong",
      data: undefined,
    };
  }
};

export const updatePasswordApi = async (password:string, newPassword:string) => {
  try {
    const { data } = await api.post(
      "/api/user/update-password",
      {password,newPassword},
      { withCredentials: true }
    );
 
    
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data as APIResponse<SessionsResponse>;
    }

    return {
      success: false,
      msg: "Something went wrong",
      data: undefined,
    };
  }
};