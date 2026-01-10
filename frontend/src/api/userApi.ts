 import type { APIResponse, Session, UserInfoData } from '@/types/types';
 import {AxiosError} from 'axios'
 import { api } from './authApi';
 export interface SessionsResponse {
  currentSession: Session;
  otherSessions: Session[];
}


export const UserInfoApi = async ():Promise<APIResponse<UserInfoData>>=>{
  try {
    // #region region agent log
    console.log('[DEBUG] UserInfo API called', { userAgent: navigator.userAgent });
    // #endregion
    const {data} = await api.get('/api/v1/users/me')
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
    // #region region agent log
    console.log('[DEBUG] All Sessions API called', { userAgent: navigator.userAgent });
    // #endregion
    const { data } = await api.get<APIResponse<SessionsResponse>>(
      "/api/v1/users/sessions",
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
    // #region region agent log
    console.log('[DEBUG] Update Password API called', { userAgent: navigator.userAgent });
    // #endregion
    const { data } = await api.post(
      "/api/v1/users/update-password",
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

export const updateProfileApi = async (name: string) => {
  try {
    // #region region agent log
    console.log('[DEBUG] Update Profile API called', { name, userAgent: navigator.userAgent });
    // #endregion
    const { data } = await api.put(
      "/api/v1/users/update-profile",
      { name },
      { withCredentials: true }
    );

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
};