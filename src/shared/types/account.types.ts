import { updateProfile } from './../../redux/slices/authSlice';
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

export interface ResetData {
  confirmPassword: string;
  password: string;
  token: CookieValueTypes;
}
   // Example structure of the authentication state
export interface AuthState {
    auth: {
      user: User;
      token: string | null;
      loading: boolean;
      error: string | null;
    };
}

export interface User {
  id?: number | null;
  email?: string;
  role?: string;
  created?: string;
  updated?: string | null;
  isVerified?: boolean;
  jwtToken?: string;
  userProfile?: UserProfile;
  userDevices?: Array<any>; 
}

export interface UserProfile {
  userID: number;
  firstName: string;
  lastName: string;
  userGenderID?: number;
  activityTypeID: number;
  homeBaseLat: number;
  homeBaseLng: number;
  homeBaseCity: string;
  homeBaseState: string;
  homeBaseCountry: string;
  defaultRadius: number;
  unitOfMeasureID: number;
  private: boolean;
  iceContact: string;
  icePhone: string;
  isDeleted: boolean;
  createdBy: number;
  createdDate: string;
  modifiedBy?: number | null;
  modifiedDate?: string | null;
  userGenderModel?: any; 
  activityTypeModel?: any; 
  unitOfMeasureModel?: any;
}

export interface UpdateProfile{
  id:number
  userdata:UserProfile
}