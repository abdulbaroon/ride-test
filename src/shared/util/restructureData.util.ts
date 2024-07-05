import dayjs from 'dayjs';
import { RouteData } from '../types/addRide.types';



interface UserProfile {
  userID: string;
}

interface Payload {
  user: { userProfile: UserProfile };
  routeData: RouteData;
}

const restructureRideData = (payload: Payload) => {
  const { user, routeData } = payload;
  const { userID } = user?.userProfile ?? {};
  const currentDate = new Date();

  return {
    activity: {
      activityID: routeData?.activityID,
      activityTypeID: routeData?.rideTypeID,
      userID,
      activityName: routeData?.rideName,
      startName: routeData?.startName || '',
      createdBy: routeData?.createdBy || userID,
      startW3W: routeData?.startW3W || null,
      activityDate: dayjs(routeData?.startDate).format('YYYY-MM-DD'),
      activityStartTime: dayjs(routeData.startTime).format('HH:mm:ss'),
      activityEndTime: dayjs(routeData.endTime).format('HH:mm:ss'),
      createdDate: routeData?.createdDate || currentDate,
      modifiedBy: userID,
      modifiedDate: currentDate,
      isCommunity: routeData?.isCommunity || false,
      isDrop: routeData?.isDrop || false,
      isPrivate: routeData?.isPrivate || false,
      isLightsRequired: routeData?.isLightsRequired || false,
      startAddress: routeData?.startAddress,
      startCity: routeData?.startCity,
      startState: routeData?.startState,
      startCountry: routeData?.startCountry,
      startLat: routeData?.startLat,
      startLng: routeData?.startLng,
      activityNotes: routeData?.rideNotes ?? 'Lets ride and be respectful to each other!',
      eventLink: routeData?.eventLink ?? null,
      isCancelled: routeData?.isCancelled || false,
      isPromoted: routeData?.isPromoted || false,
      isGroup: routeData?.isGroup || false,
      hasWaiver: routeData.HasWaiver || false,
      parentActivityID: routeData?.parentActivityID || 0,
      teamID: routeData?.teamID || 0,
      isDeleted: routeData?.isDeleted || false,
    },
    activityRoute: [
      {
        routeName: routeData?.routeName?.replace('/', '_').replace(' ', '_') ||
          routeData?.rideName?.replace('/', '_').replace(' ', '_'),
        mapSourceID: routeData.mapSourceID ,
        isPrimary: true,
        difficultyLevelID: routeData?.difficultyLevelID,
        distance: Number(routeData?.distance),
        speed: Number(routeData?.avgSpeed),
        routeNumber: routeData?.routeNumber ?? null,
        mapUrl: routeData.mapUrl ?? null,
      },
    ],
    activityTags: routeData?.tags?.map((item: string) => item) || [],
    dalleUrl: routeData?.dalleUrl || null,
  };
}

const restructureActivityTags = (arr: any[]) => {
  return arr;
}
