export interface WeatherForecast {
    forecastDate: string; 
    weatherDescription: string;
    weatherIcon: string;
    currentTemp: string; 
    feelsLikeTemp: string; 
    windSpeed: string; 
    windGusts: string; 
    precip: string;  
    humidity: string;
    sunrise: string; 
    sunset: string; 
    windDegree: number; 
  }

  export interface ActivityChatPayload {
      activityID: number;
      userID: number | null | undefined;
      createdBy: number | null | undefined;
      createdDate: string;
      modifiedBy: number | null | undefined;
      modifiedDate: string;
      chatMessage: string;
  };
  export interface ActivityChat {
    activityChatID: number;
    activityID: number;
    chatMessage: string;
    createdBy: number;
    createdDate?: string | null;
    isDeleted: boolean;
    isUser: boolean;
    modifiedBy: number;
    modifiedDate: string;
    userFirstName: string;
    userFullName: string;
    userLastName: string;
    userProfileModel?: any; 
    userID?:number
  }

  export interface ActivityRoster {
    activityID: number ;
    responseTypeID: number;
    groupLevel?: string | null ; 
    createdBy: number | null | undefined ; 
    createdDate: string;
    modifiedBy: number  | null | undefined ; 
    modifiedDate: string;
  }

  interface ResponseTypeModel {
    responseTypeID: number;
    responseTypeName: string;
    responseColor: string;
  }
  
  interface UserProfileModel {
    userID: number;
    firstName: string;
    lastName: string;
    userGenderID: number;
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
    modifiedBy: number;
    modifiedDate: string;
    userGenderModel: null | any;
    activityTypeModel: null | any; 
    unitOfMeasureModel: null | any; 
  }
  
 
  export interface RosterDetail {
    activityRosterID: number;
    activityID: number;
    responseTypeID: number;
    groupLevel: null | string; 
    createdBy: number;
    createdDate: string;
    modifiedBy: number;
    modifiedDate: string;
    responseTypeModel: ResponseTypeModel;
    userProfileModel: UserProfileModel;
  }


  interface MapSourceModel {
    mapSourceID: number;
    mapSourceName: string;
    mapSourceRouteUrl?: string | null;
    mapSourceUrlScheme?: string | null;
    isShownForRoutes: boolean;
    mapSourceColor?: string | null;
    isActive: boolean;
  }
  
  interface DifficultyLevelModel {
    difficultyLevelID: number;
    levelName: string;
    levelDescription: string;
    levelColor: string;
    levelIcon: string;
  }
  
  export interface ActivityRoute {
    activityRouteID: number;
    activityID: number;
    routeName: string;
    mapSourceID: number;
    isPrimary: boolean;
    difficultyLevelID: number;
    distance: number;
    speed: number;
    routeNumber?: number | null;
    mapUrl: string;
    gpxRoutePath: string;
    geoRoutePath: string;
    isDeleted: boolean;
    createdBy: number;
    createdDate: string;
    modifiedBy: number;
    modifiedDate: string;
    mapSourceModel: MapSourceModel;
    difficultyLevelModel: DifficultyLevelModel;
  }

  interface UserProfileModel {
    userID: number;
    firstName: string;
    lastName: string;
    userGenderID: number;
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
    modifiedDate: string;
  }
  
  export interface UserFollowingData {
    userFollowingID: number;
    userID: number;
    followingID: number;
    isConfirmed: boolean;
    createdBy: number;
    createdDate: string;
    userProfileModel: UserProfileModel;
    userProfileModelFollowing: UserProfileModel;
  }