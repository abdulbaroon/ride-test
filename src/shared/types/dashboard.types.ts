export interface RideListParams {
  id: number;
  radius: number;
  feedType: string;
}

export interface LeaderBoardItem {
  fullName: string;
  pointAmount: number;
  userID?:number
}

export interface DashboardWeatherForecast {
  forecastDate: string;
  conditionSummary: string;
  conditionIcon: string;
  lowTemp: string;
  highTemp: string;
  windSpeed: string;
  windDirection: string;
}
export interface ActivityTagModel {
  activityTagName: string;
}

export interface ActivityPictureModel {
  isMap: boolean;
  picturePath: string;
}

export interface ActivityRouteModel {
  speed: number;
  distance: number;
  mapUrl: string;
  difficultyLevelID: number;
  difficultyLevelModel: {
    levelName: string;
    levelColor: string;
    levelIcon: string;
    levelDescription: string;
  };
  mapSourceID: number;
  mapSourceModel: {
    mapSourceName: string;
  };
  activityRouteID: number;
  gpxRoutePath: string;
}

export interface ActivityCountsModel {
  viewCount: number;
}

export interface ActivityHubDetailModel {
  hubName: string;
  hubLogoUrl: string;
}

interface UserProfileModel {
  firstName: string;
  lastName: string;
}

interface ResponseTypeModel {
  responseTypeID: number;
  responseTypeName: string;
  responseColor: string;
}

interface ActivityRoster {
  activityRosterID: number;
  activityID: number;
  responseTypeID: number;
  groupLevel: null | string; 
  createdBy: number;
  createdDate: string;
  modifiedBy: number;
  modifiedDate: string;
  responseTypeModel: ResponseTypeModel;
  userProfileModel: null | UserProfileModel; 
}

export interface Item {
  userID: number;
  activityID: number;
  routeName?: string;
  activityName: string;
  startName?: string;
  startAddress?: string;
  startCity?: string;
  startState?: string;
  startCountry?: string;
  startW3W?: string;
  startLng?: number;
  startLat?: number;
  activityNotes?: string;
  activityPictureModel?: ActivityPictureModel[];
  activityRouteModel?: ActivityRouteModel[];
  activityDate?: string;
  activityStartTime?: string | any;
  activityEndTime?: string;
  activityTagModel?: ActivityTagModel[];
  dalleUrl?: string;
  isDrop?: boolean;
  isCommunity?: boolean;
  isPrivate?: boolean;
  isLightsRequired?: boolean;
  isGroup?: boolean;
  isCancelled?: boolean;
  isDeleted?: boolean;
  hasWaiver?: boolean | null;
  teamID?: number;
  activityHubDetailModel?: ActivityHubDetailModel;
  userProfileModel?: UserProfileModel;
  unitOfMeasureID?: number;
  activityTypeID?: number;
  activityTypeModel?: {
    activityTypeName: string;
    activityTypeColor: string;
  };
  activityCountsModel?: ActivityCountsModel;
  activityRosterModel:ActivityRoster[]

}

export interface FormattedRideData {
  userID: number;
  activityID: number;
  routeName: string;
  rideName: string;
  startName?: string;
  startAddress?: string;
  startCity?: string;
  startState?: string;
  startCountry?: string;
  startW3W?: string;
  startLng?: number;
  startLat?: number;
  rideNotes: string;
  avgSpeed?: number;
  distance?: number;
  mapUrl?: string;
  difficultyLevelID?: number;
  difficultyLevelName?: string;
  difficultyLevelColor?: string;
  difficultyLevelIcon?: string;
  difficultyLevelDescription?: string;
  mapSourceID?: number;
  mapSourceType?: string;
  activityRouteID?: number;
  startDate?: string | any;
  startTime?: string | any;
  endTime?: string | any;
  activityDateTime?: string | any;
  tags: ActivityTagModel[];
  dalleUrl?: string;
  image?: { path: string };
  gpxFilePathUrl?: string;
  rideTypeID?: number;
  rideType?: string;
  rideTypeColor?: string;
  mapImage: string;
  isDrop: boolean;
  isPrivate: boolean;
  isLightsRequired: boolean;
  isCommunity: boolean;
  isCancelled: boolean;
  isGroup: boolean;
  isDeleted: boolean;
  selectItem?: string[];
  hasWaiver: boolean | null;
  document?: string | null;
  rideViews: number;
  hubID: number;
  hubName: string;
  hubLogoUrl: string;
  rideCreateFirstName: string;
  rideCreateLastName: string;
  rideCreateUoM: number;
  rosterModal:ActivityRoster[]
}


interface Picture {
  isMap: boolean;
  picturePath: string;
}

interface ActivityRoute {
  distance: number;
  mapUrl: string;
  difficultyLevelID: number;
  difficultyLevelModel: {
    levelName: string;
    levelColor: string;
    levelIcon: string;
    levelDescription: string;
  };
  activityRouteID: number;
  speed:number
}

interface ActivityCounts {
  viewCount: number;
}

interface UserProfile {
  firstName: string;
  lastName: string;
}

export interface RideItem {
  userID: number;
  activityID?: number;
  routeName?: string;
  activityName: string;
  startName?: string;
  startAddress?: string;
  startCity?: string;
  startState?: string;
  startCountry?: string;
  startLng?: number;
  startLat?: number;
  activityRoutes?: ActivityRoute[];
  activityDate?: string;
  activityStartTime?: string | any;
  activityEndTime?: string;
  activityTypeID?: number;
  activityTypeName?: string;
  activityPictures?: Picture[];
  isDrop?: boolean;
  isPrivate?: boolean;
  isLightsRequired?: boolean;
  isCommunity?: boolean;
  isCancelled?: boolean;
  isGroup?: boolean;
  isDeleted?: boolean;
  activityCountsModel?: ActivityCounts;
  userProfileModel?: UserProfile;
  viewCount?: number;
  likeCount?: number;
  chatCount?: number;
  rosterCount?: number;
  userHasLiked?: boolean | undefined
}

export interface FormattedRide {
  speed:number|undefined
  userID: number;
  activityID?: number;
  routeName: string;
  rideName: string;
  startName?: string;
  startAddress?: string;
  startCity?: string;
  startState?: string;
  startCountry?: string;
  startLng?: number;
  startLat?: number;
  distance?: number;
  mapUrl?: string;
  difficultyLevelID?: number;
  difficultyLevelName?: string;
  difficultyLevelColor?: string;
  difficultyLevelIcon?: string;
  difficultyLevelDescription?: string;
  activityRouteID?: number;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  activityDateTime: string | any;
  rideTypeID?: number;
  rideType?: string;
  mapImage: string;
  image:string;
  isDrop: boolean;
  isPrivate: boolean;
  isLightsRequired: boolean;
  isCommunity: boolean;
  isCancelled: boolean;
  isGroup: boolean;
  isDeleted: boolean;
  rideViews: number;
  rideCreateFirstName: string;
  rideCreateLastName: string;
  viewCount?: number;
  likeCount?: number;
  chatCount?: number;
  rosterCount?: number;
  userHasLiked?: boolean | undefined
}

export interface Explore {
  exploreType: string;
  entityID: number;
  entityName: string;
  entityDate: string; 
  entityCity: string;
  entityState: string;
  entityCountry: string;
  entityLat: number;
  entityLng: number;
  entityPrivate: boolean;
  entityRosterOrConnected: boolean;
}