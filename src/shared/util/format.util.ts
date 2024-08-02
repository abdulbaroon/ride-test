import { format } from "date-fns"
import { FormattedRide, FormattedRideData, Item, RideItem } from "../types/dashboard.types"
import { IMAGE_URl } from "@/constant/appConfig"
import { getTimeToDate } from "./dateFormat.util"

export const extractRouteId = (url: string) => {
    const regex = /\/routes\/(\d+)/
    const match = url?.match(regex)
  
    if (match && match[1]) {
      return match[1]
    } else {
      return null
    }
  }

  export const readFileAsBase64 = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const reader = new FileReader();
            reader.onloadend = function () {
                const base64Part = reader?.result ? (reader.result as string).split(',')[1] : '';
                resolve(base64Part);
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = function (error) {
            reject(error);
        };
        xhr.open('GET', filePath);
        xhr.responseType = 'blob';
        xhr.send();
    });
};

 export function fileToBase64(file:File) {
  return new Promise((resolve, reject) => {  
    const reader = new FileReader();
    
    reader.onload = () => {      
      if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
      } else {
          reject(new Error("Reader result is not a string"));
      }
  };
    
    reader.onerror = error => reject(error);
    
    reader.readAsDataURL(file);
  });
}


export const formatRideData = (item: Item): FormattedRideData => {
 
  const mapImage = item?.activityPictureModel?.find((pic) => pic.isMap)?.picturePath || '';

  const formatDateTime = (date: string | undefined, time: string | undefined): string | undefined => {
    if (!date || !time) return undefined;
    const dateTime = new Date(`${date}T${time}`);
    return format(dateTime, 'yyyy-MM-dd HH:mm:ss');
  };

  return {
    userID: item.userID,
    activityID: item?.activityID,
    routeName: item?.routeName || '',
    rideName: item?.activityName,
    startName: item?.startName,
    startAddress: item?.startAddress,
    startCity: item?.startCity,
    startState: item?.startState,
    startCountry: item?.startCountry,
    startW3W: item?.startW3W,
    startLng: item?.startLng,
    startLat: item?.startLat,
    rideNotes: item?.activityNotes || '',
    avgSpeed: item?.activityRouteModel?.[0]?.speed,
    distance: item?.activityRouteModel?.[0]?.distance,
    mapUrl: item?.activityRouteModel?.[0]?.mapUrl,
    difficultyLevelID: item?.activityRouteModel?.[0]?.difficultyLevelID,
    difficultyLevelName: item?.activityRouteModel?.[0]?.difficultyLevelModel.levelName,
    difficultyLevelColor: item?.activityRouteModel?.[0]?.difficultyLevelModel.levelColor,
    difficultyLevelIcon: item?.activityRouteModel?.[0]?.difficultyLevelModel.levelIcon,
    difficultyLevelDescription: item?.activityRouteModel?.[0]?.difficultyLevelModel.levelDescription,
    mapSourceID: item?.activityRouteModel?.[0]?.mapSourceID,
    mapSourceType: item?.activityRouteModel?.[0]?.mapSourceModel.mapSourceName,
    activityRouteID: item?.activityRouteModel?.[0]?.activityRouteID,
    startDate:getTimeToDate( item?.activityDate),
    startTime: getTimeToDate(item?.activityStartTime),
    endTime: item?.activityEndTime,
    activityDateTime: getTimeToDate(item.activityDate, item.activityStartTime),
    tags: item?.activityTagModel?.map((tag) => tag?.activityTagName) || [],
    dalleUrl: item?.dalleUrl ,
    image: item?.activityPictureModel
      ?.filter((pic) => !pic?.isMap)
      ?.map((pic) => ({ path: IMAGE_URl + pic?.picturePath }))[0],
    gpxFilePathUrl: item?.activityRouteModel?.[0]?.gpxRoutePath,
    rideTypeID: item?.activityTypeID,
    rideType: item?.activityTypeModel?.activityTypeName,
    rideTypeColor: item?.activityTypeModel?.activityTypeColor,
    mapImage: IMAGE_URl + mapImage,
    isDrop: item?.isDrop || false,
    isPrivate: item.isPrivate || false,
    isLightsRequired: item?.isLightsRequired || false,
    isCommunity: item?.isCommunity || false,
    isCancelled: item?.isCancelled || false,
    isGroup: item?.isGroup || false,
    isDeleted: item?.isDeleted || false,
    hasWaiver: item?.hasWaiver || false,
    document: item?.hasWaiver
      ?  IMAGE_URl + `/ridewaivers/ridewaiver_${item.activityID}.pdf`
      : null,
    rideViews: item.activityCountsModel?.viewCount || 0,
    hubID: item?.teamID || 0,
    hubName: item?.activityHubDetailModel?.hubName || '',
    hubLogoUrl: item?.activityHubDetailModel?.hubLogoUrl || '',
    rideCreateFirstName: item?.userProfileModel?.firstName || '',
    rideCreateLastName: item?.userProfileModel?.lastName || '',
    rideCreateUoM: item?.unitOfMeasureID || 1,
  };
};






export const formatRideList = (item: RideItem): FormattedRide => {
  const mapImage = item?.activityPictures?.find((pic) => pic.isMap)?.picturePath || '';

  return {
    userID: item.userID,
    activityID: item?.activityID,
    routeName: item?.routeName || '',
    rideName: item?.activityName,
    startName: item?.startName,
    startAddress: item?.startAddress,
    startCity: item?.startCity,
    startState: item?.startState,
    startCountry: item?.startCountry,
    startLng: item?.startLng,
    startLat: item?.startLat,
    distance: item?.activityRoutes?.[0]?.distance,
    mapUrl: item?.activityRoutes?.[0]?.mapUrl,
    difficultyLevelID: item?.activityRoutes?.[0]?.difficultyLevelID,
    difficultyLevelName: item?.activityRoutes?.[0]?.difficultyLevelModel.levelName,
    difficultyLevelColor: item?.activityRoutes?.[0]?.difficultyLevelModel.levelColor,
    difficultyLevelIcon: item?.activityRoutes?.[0]?.difficultyLevelModel.levelIcon,
    difficultyLevelDescription: item?.activityRoutes?.[0]?.difficultyLevelModel.levelDescription,
    activityRouteID: item?.activityRoutes?.[0]?.activityRouteID,
    startDate: item?.activityDate,
    startTime: item?.activityStartTime,
    endTime: item?.activityEndTime,
    activityDateTime: getTimeToDate(item.activityStartTime, item.activityDate),
    rideTypeID: item?.activityTypeID,
    rideType: item?.activityTypeName,
    mapImage: IMAGE_URl + mapImage,
    isDrop: item?.isDrop || false,
    isPrivate: item.isPrivate || false,
    isLightsRequired: item?.isLightsRequired || false,
    isCommunity: item?.isCommunity || false,
    isCancelled: item?.isCancelled || false,
    isGroup: item?.isGroup || false,
    isDeleted: item?.isDeleted || false,
    rideViews: item.activityCountsModel?.viewCount || 0,
    rideCreateFirstName: item?.userProfileModel?.firstName || '',
    rideCreateLastName: item?.userProfileModel?.lastName || '',
    viewCount: item?.viewCount,
    likeCount: item?.likeCount,
    chatCount: item?.chatCount,
    rosterCount: item?.rosterCount,
    userHasLiked:item?.userHasLiked
  };
};
