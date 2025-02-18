export type Geojson = {
  centerLatitude: number;
  centerLongitude: number;
  geoJSON: {
    features?: any[];
  };
  loading: boolean;
  isRouteTest: boolean;
  url: string;
  error: boolean;
  errorMessage: string;
  gpxFilePath: string;
  routeDistance: string;
};

export interface RouteData {
  activityID?: number;
  rideType?: number;
  rideName?: string;
  startName?: string;
  createdBy?: string;
  startW3W?: string | null;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  createdDate?: Date;
  isCommunity?: boolean;
  isDrop?: boolean;
  isPrivate?: boolean;
  isLights?: boolean;
  startAddress?: string;
  startCity?: string;
  startState?: string;
  startCountry?: string;
  startLat?: number;
  startLng?: number;
  rideNotes?: string;
  eventLink?: string;
  isCancelled?: boolean;
  isPromoted?: boolean;
  isGroup?: boolean;
  HasWaiver?: boolean;
  parentActivityID?: number;
  hubID?: number;
  isDeleted?: boolean;
  document?: { uri: string };
  image?: { path: string };
  geoJSON?: any;
  gpxFilePath?: string;
  tags?: string[];
  dalleUrl?: string;
  difficulty?: number;
  distance?: number;
  avgSpeed?: number;
  routeNumber?: string;
  mapUrl?: string;
  routeName?: string;
  mapSourceID?: number;
  note?: string;
}

export interface AddRidePayload {
  Activity?: RouteData;
  FileUploads?: number;
  ActivityRoute?: {
    filePath?: string;
    activityID?: number;
    fileUploadTypeID?: number;
  }[];
  ActivityTags?: string[];
  DalleUrl?: string;
}

export interface SearchRide {
  userID: number;
  startLat: number;
  startLng: number;
  radius: number;
  activityName: string | null;
  startDate: string | null;
  endDate: string | null;
  activityTypeID: number | null;
  difficultyLevelID: number | null;
  minDistance: number | null;
  maxDistance: number | null;
}

export interface DifficultyLevel {
  difficultyLevelID: number;
  levelName: string;
  levelDescription: string;
  levelColor: string;
  levelIcon: string;
}
export interface ActivityType {
  activityTypeID: number;
  activityTypeName: string;
  activityTypeIcon: string;
  activityTypeColor: string;
}