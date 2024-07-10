import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { RouteData } from '@/shared/types/addRide.types';
import { readFileAsBase64 } from '@/shared/util/format.util';
import { api } from '@/shared/api';
import { uploadedFile } from '@/redux/slices/authSlice';
import { addRide } from '@/redux/slices/addRideSlice';

interface UserProfile {
    userID: string;
}

interface Payload {
    user?: { userProfile?: UserProfile };
    routeData?: RouteData;
}

interface FileUploadModel {
    activityID: number;
    fileUploadTypeID: number;
    uploadedFile: string;
}

const restructureRideData = (payload: Payload) => {
    const { user, routeData } = payload;
    const { userID } = user?.userProfile ?? {};
    const currentDate = new Date();

    return {
        activity: {
            activityID: routeData?.activityID,
            activityTypeID: routeData?.rideType,
            userID,
            activityName: routeData?.rideName,
            startName: routeData?.startName || '',
            createdBy: routeData?.createdBy || userID,
            startW3W: routeData?.startW3W || null,
            activityDate: routeData?.startDate,
            activityStartTime: routeData?.startTime+":00",
            activityEndTime: routeData?.endTime+":00",
            createdDate: routeData?.createdDate || currentDate,
            modifiedBy: userID,
            modifiedDate: currentDate,
            isCommunity: routeData?.isCommunity || false,
            isDrop: routeData?.isDrop || false,
            isPrivate: routeData?.isPrivate || false,
            isLightsRequired: routeData?.isLights || false, 
            startAddress: routeData?.startAddress,
            startCity: routeData?.startCity,
            startState: routeData?.startState,
            startCountry: routeData?.startCountry,
            startLat: routeData?.startLat,
            startLng: routeData?.startLng,
            activityNotes: routeData?.note ?? 'Lets ride and be respectful to each other!',
            eventLink: routeData?.eventLink ?? null,
            isCancelled: routeData?.isCancelled || false,
            isPromoted: routeData?.isPromoted || false,
            isGroup: routeData?.isGroup || false,
            hasWaiver: routeData?.HasWaiver || false,
            parentActivityID: routeData?.parentActivityID || 0,
            teamID: routeData?.teamID || 0,
            isDeleted: routeData?.isDeleted || false,
        },
        activityRoute: [
            {
                routeName: routeData?.routeName?.replace('/', '_').replace(' ', '_') ||
                    routeData?.rideName?.replace('/', '_').replace(' ', '_'),
                mapSourceID: Number(routeData?.mapSourceID),
                isPrimary: true,
                difficultyLevelID: routeData?.difficulty,
                distance: Number(routeData?.distance),
                speed: Number(routeData?.avgSpeed),
                routeNumber: routeData?.routeNumber ?? null,
                mapUrl: routeData?.mapUrl ?? null,
            },
        ],
        activityTags: routeData?.tags,
        dalleUrl: routeData?.dalleUrl || null,
    };
}

const getMapSourceID = (url: string | null | undefined): { mapSourceID: number } => {
    if (url?.includes('ridewithgps.com')) {
        return { mapSourceID: 1 };
    } else if (url?.includes('strava.com')) {
        return { mapSourceID: 2 };
    } else if (url?.includes('connect.garmin.com')) {
        return { mapSourceID: 3 };
    } else if (url?.endsWith('.gpx') || url?.endsWith('.jpx')) {
        return { mapSourceID: 5 };
    } else {
        return { mapSourceID: 4 }; 
    }
}

export const saveRide = async (
    dispatch: any,
    onSuccess: (response: any) => void,
    onError: (error: any) => void,
    payload: any
) => {
    try {
        const fileUploadModelBinary: Array<FileUploadModel> = [];
        let activityID: number | null = null;
        let fileupload = null;

        const { routeData, user } = payload;
        const { mapSourceID } = getMapSourceID(routeData?.mapUrl || routeData?.gpxFilePath);

        const res = await api.get(`/activity/${user?.userProfile?.userID}/nextid`);

        if (res?.data) {
            activityID = res?.data?.activityID;
        }

        if (activityID && routeData?.document) {
            const pdfBinary = await readFileAsBase64(routeData?.document);
            routeData.HasWaiver = true;
            fileUploadModelBinary.push({
                activityID,
                fileUploadTypeID: 2,
                uploadedFile: pdfBinary,
            });
        }

        if (activityID && routeData?.image) {
            const imageBinary = await readFileAsBase64(routeData?.image);
            fileUploadModelBinary.push({
                activityID,
                fileUploadTypeID: 1,
                uploadedFile: imageBinary,
            });
        }

        if (activityID && routeData?.geoJSON) {
            const geoJSONString = JSON.stringify(routeData.geoJSON);
            const geoBinary = Buffer.from(geoJSONString).toString('base64');
            fileUploadModelBinary.push({
                activityID,
                fileUploadTypeID: 4,
                uploadedFile: geoBinary,
            });
        }
        

        if (activityID && routeData?.gpxFilePath) {
            const gpxBinary = await readFileAsBase64(routeData?.gpxFilePath);
            fileUploadModelBinary.push({
                activityID,
                fileUploadTypeID: 3,
                uploadedFile: gpxBinary,
            });
        }

        if (fileUploadModelBinary.length > 0) {
            const filePayload = { fileUploadModelBinary };
            const data = await dispatch(uploadedFile(filePayload));
            fileupload = data || null;
        }

        const { activity, activityRoute, activityTags, dalleUrl } = restructureRideData({
            routeData: { activityID, mapSourceID, ...routeData },
            user,      
        });

        const activityConsolidatedPayload = {
            Activity: activity,
            FileUploads: mapSourceID === 4 ? null : fileupload.payload || null ,
            ActivityRoute: activityRoute,
            ActivityTags: activityTags,
            DalleUrl: dalleUrl,
        };

        const response = await dispatch(addRide(activityConsolidatedPayload));
        onSuccess(response.data);
    } catch (error:any) {
        onError(error.message || '');
        console.log(error)
    }
}
