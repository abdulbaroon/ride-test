interface HubTypeModel {
    hubTypeID: number;
    hubTypeName: string;
  }
  
export interface Hub {
    hubID: number;
    hubTypeID: number;
    hubName: string;
    hubRouteName: string;
    hubLat: number;
    hubLng: number;
    hubAddress: string;
    hubAddress2?: string; 
    hubCity: string;
    hubState: string;
    hubZip: string;
    hubCountry: string;
    hubPhone?: string; 
    hubEmail?: string; 
    hubUrl?: string; 
    hubLogoUrl: string;
    hubSocialUrl?: string; 
    isPrivate: boolean;
    isDeleted: boolean;
    createdBy: number;
    createdDate: string;
    modifiedBy: number;
    modifiedDate: string;
    userInHub: boolean;
    activeMembers: number;
    activityCount: number;
    hubTypeModel: HubTypeModel;
  }
  

export interface HubMemberRoleModel {
    hubMemberRoleID: number;
    hubMemberRole: string;
}


export interface UserProfileModel {
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
    userGenderModel?: any; 
    activityTypeModel?: any; 
    unitOfMeasureModel?: any; 
}


export interface HubMember {
    hubMemberID: number;
    hubID: number;
    userID: number;
    hubMemberRoleID: number;
    isApproved: boolean;
    userProfileModel: UserProfileModel;
    hubMemberRoleModel: HubMemberRoleModel;
}


interface ActivityPicture {
  activityPictureID: number;
  activityID: number;
  picturePath: string;
  isMap: boolean;
  isDeleted: boolean;
}

interface ActivityRoute {
  activityRouteID: number;
  activityID: number;
  routeName: string;
  mapSourceID: number;
  isPrimary: boolean;
  difficultyLevelID: number;
  distance: number;
  speed: number;
  routeNumber: string;
  mapUrl: string;
  gpxRoutePath: string;
  geoRoutePath: string;
  isDeleted: boolean;
  createdBy: number;
  createdDate: string;
  modifiedBy: number;
  modifiedDate: string;
  mapSourceModel?: any; // Assuming no specific model is provided
  difficultyLevelModel: {
    difficultyLevelID: number;
    levelName: string;
    levelDescription: string;
    levelColor: string;
    levelIcon: string;
  };
}

export interface HubActivity {
  activityID: number;
  activityTypeID: number;
  activityTypeName: string;
  activityTypeIcon: string;
  activityTypeColor: string;
  userID: number;
  userFirstName: string;
  userLastName: string;
  activityName: string;
  activityDate: string;
  activityStartTime: string;
  activityEndTime: string;
  startName: string;
  startAddress: string;
  startCity: string;
  startState: string;
  startCountry: string;
  startLat: number;
  startLng: number;
  startW3W: string;
  activityNotes: string;
  eventLink: null | string;
  isPrivate: boolean;
  isCancelled: boolean;
  isPromoted: boolean;
  isGroup: boolean;
  hasWaiver: boolean;
  isCommunity: boolean;
  isDrop: boolean;
  isLightsRequired: boolean;
  parentActivityID: number;
  hubID: number;
  hubName: string;
  hubTypeName: string;
  viewStatus: string;
  viewCount: number;
  likeCount: number;
  chatCount: number;
  rosterCount: number;
  userHasLiked: boolean;
  userInRoster: boolean;
  userResponseName: null | string;
  userResponseColor: null | string;
  groupLevel: null | string;
  isDeleted: boolean;
  createdBy: number;
  createdDate: string;
  modifiedBy: number;
  modifiedDate: string;
  activityOwner: null | string;
  activityPictures: ActivityPicture[];
  activityRoutes: ActivityRoute[];
  activityRoster: null | string;
}