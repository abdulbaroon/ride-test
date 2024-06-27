import { CookieValueTypes } from "cookies-next";

export interface LoginFormValues {
    email: string;
    password: string;
  }
 export interface RegisterFormValues {
    acceptTerms: boolean;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ResetData{
  confirmPassword: string;
  password: string;
  token: CookieValueTypes;
}