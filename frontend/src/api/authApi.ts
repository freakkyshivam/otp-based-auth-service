 import type {
  APIResponse, 
  LoginSuccessResponse, 
  LoginErrorResponse,
  signupResponse,
  NormalApiResponse
 } from '@/types/types';
import axios,{AxiosError} from 'axios'
import {logoutPure} from '@/utils/logout'
 
 

type LoginResponse = LoginSuccessResponse | LoginErrorResponse;
 

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials:true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});


api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest.url.includes("/auth/token/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // #region agent log
        console.log('[DEBUG] Refreshing token', { url: originalRequest.url });
        // #endregion
        const res = await api.post(
          "/api/auth/token/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        // #region agent log
        console.log('[DEBUG] Token refreshed', { 
          hasAccessToken: !!newAccessToken,
          setCookieHeaders: res.headers['set-cookie'] || 'none'
        });
        // #endregion

         
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        await logoutPure();
    return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


export const loginApi = async (email:string, password:string):Promise<LoginResponse>=>{
      try {
        // #region agent log
        console.log('[DEBUG] Login API called', { email, hasCredentials: true, userAgent: navigator.userAgent });
        // #endregion
        const {data, headers} = await api.post(`/api/auth/login`,{
          email ,
          password
        },{withCredentials:true} )
        // #region agent log
        console.log('[DEBUG] Login response', { 
          success: data?.success, 
          hasAccessToken: !!data?.accessToken,
          setCookieHeaders: headers['set-cookie'] || 'none'
        });
        // #endregion
        
        return data;
      } catch (error : unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
    
    };
  }
}
 

export const signupApi = async (
  name: string,
  email: string,
  password: string
):Promise<APIResponse<signupResponse>> => {
  try {
    // #region region agent log
    console.log('[DEBUG] Signup API called', { email, userAgent: navigator.userAgent });
    // #endregion
    const { data } = await api.post(`/api/auth/register`,
      { name, email, password }
    );

    return data;
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
    };
  }
};


export const verifyRegistrationOtpApi = async(
  email :string, 
  otp : string,
):Promise<APIResponse<signupResponse>>=>{
  try {
    // #region region agent log
    console.log('[DEBUG] Verify Registration OTP API called', { email, userAgent: navigator.userAgent });
    // #endregion

   const { data } = await api.post(
      `/api/auth/verify-register-otp`,
      {email,otp },
       
    );
    
    return data;
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
    };
  }
}

export const logoutApi = async ()=>{
  try {
    // #region region agent log
    console.log('[DEBUG] Logout API called', { userAgent: navigator.userAgent });
    // #endregion
    const {data} = await api.post('/api/auth/logout',{})

    return data;
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
    };
  }
}

 export const revokeSessionApi = async (sid : string)=>{
  try {
    // #region region agent log
    console.log('[DEBUG] Revoke Session API called', { sid, userAgent: navigator.userAgent });
    // #endregion
    const {data} = await api.post('/api/auth/sessions/revoke',{sid})

    return data;
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
    };
  }
 }

 export const terminateAllOtherSessionsApi = async()=>{
  try {
    // #region region agent log
    console.log('[DEBUG] Terminate All Other Sessions API called', { userAgent: navigator.userAgent });
    // #endregion

    await api.post('/api/auth/sessions/terminate-others',{},{
      withCredentials : true
    })
    
   } catch (error : unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
    };
  }
 }

 export const twoFASetupApi = async()=>{
  try {
    // #region region agent log
    console.log('[DEBUG] 2FA Setup API called', { userAgent: navigator.userAgent });
    // #endregion

   const {data} = await api.post('/api/auth/mfa/setup',{},{
      withCredentials : true
    })
    return data;
   } catch (error : unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
    };
  }
 }

  export const verifyFASetupApi = async(otp:string)=>{
  try {
    // #region region agent log
    console.log('[DEBUG] Verify 2FA Setup API called', { userAgent: navigator.userAgent });
    // #endregion

    const {data} = await api.post('/api/auth/mfa/verify',{otp},{
      withCredentials : true
    })

    return data;
    
   } catch (error : unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
    };
  }
 }

  export const verify2FALoginApi = async(code:string, type:string):Promise<LoginResponse>=>{
  try {
    // #region region agent log
    console.log('[DEBUG] Verify 2FA Login API called', { type, userAgent: navigator.userAgent });
    // #endregion

    const {data} = await api.post('/api/auth/login/verify2fa',{code,type},{
      withCredentials : true
    })

    return data;
    
   } catch (error : unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
    };
  }
 }

  export const disable2Fa = async(password:string):Promise<NormalApiResponse>=>{
  try {
    // #region region agent log
    console.log('[DEBUG] Disable 2FA API called', { userAgent: navigator.userAgent });
    // #endregion

    const {data} = await api.post('/api/auth/mfa/disabled',{password},{
      withCredentials : true
    })
 

    return data;
    
   } catch (error : unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
    };
  }
 }

 export const generateNewBackupCodeApi =  async(password:string):Promise<NormalApiResponse>=>{
  try {
    // #region region agent log
    console.log('[DEBUG] Generate New Backup Code API called', { userAgent: navigator.userAgent });
    // #endregion

    const {data} = await api.post('/api/auth/mfa/generate-new-backup-codes',{password},{
      withCredentials : true
    })


    return data;

   } catch (error : unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
    };
  }
 }

 export const sendPasswordResetOtpApi = async (email: string): Promise<NormalApiResponse> => {
  try {
    // #region region agent log
    console.log('[DEBUG] Send Password Reset OTP API called', { email, userAgent: navigator.userAgent });
    // #endregion
    const { data } = await api.post('/api/auth/password/reset-otp', { email });

    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
    };
  }
};

export const verifyResetOtpApi = async (email: string, otp: string): Promise<NormalApiResponse> => {
  try {
    // #region region agent log
    console.log('[DEBUG] Verify Reset OTP API called', { email, userAgent: navigator.userAgent });
    // #endregion
    const { data } = await api.post('/api/auth/password/verify-otp', { email, otp });

    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
    };
  }
};

export const resetPasswordApi = async (email: string, otp: string, newPassword: string): Promise<NormalApiResponse> => {
  try {
    // #region region agent log
    console.log('[DEBUG] Reset Password API called', { email, userAgent: navigator.userAgent });
    // #endregion
    const { data } = await api.post('/api/auth/password/reset', { email, otp, newPassword });

    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }

    return {
      success: false,
      msg: "Something went wrong",
    };
  }
};