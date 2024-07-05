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
    rideTypeID?: number;
    rideName?: string;
    startName?: string;
    createdBy?: string;
    startW3W?: string;
    startDate?: string;
    startTime?: string;
    endTime?: string;
    createdDate?: Date;
    isCommunity?: boolean;
    isDrop?: boolean;
    isPrivate?: boolean;
    isLightsRequired?: boolean;
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
    teamID?: number;
    isDeleted?: boolean;
    document?: { uri: string };
    image?: { path: string };
    geoJSON?: any;
    gpxFilePath?: string;
    tags?: string[];
    dalleUrl?: string;
    difficultyLevelID?: number;
    distance?: number;
    avgSpeed?: number;
    routeNumber?: string;
    mapUrl?: string;
    routeName?:string
    mapSourceID?:number
  }