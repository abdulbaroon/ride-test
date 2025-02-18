import { RouteData } from '@/shared/types/addRide.types';
import { fileToBase64, readFileAsBase64 } from '@/shared/util/format.util';
import { api } from '@/shared/api';
import { uploadedFile } from '@/redux/slices/authSlice';
import { addRide } from '@/redux/slices/addRideSlice';
import { format } from 'date-fns';

/**
 * Interface representing the user's profile information.
 * @property {string} userID - The ID of the user.
 */
interface UserProfile {
    userID: string;
}

/**
 * Interface representing the payload data for the ride creation process.
 * @property {object} [user] - Optional user data, including profile information.
 * @property {RouteData} [routeData] - Optional route data for the ride.
 */
interface Payload {
    user?: { userProfile?: UserProfile };
    routeData?: RouteData;
}

/**
 * Interface representing the structure for file uploads associated with the activity.
 * @property {number} activityID - The ID of the activity to which the file belongs.
 * @property {number} fileUploadTypeID - The type of file being uploaded.
 * @property {string} uploadedFile - The base64-encoded content of the uploaded file.
 */
interface FileUploadModel {
    activityID: number;
    fileUploadTypeID: number;
    uploadedFile: string;
}

/**
 * Restructures the ride data into a format suitable for API consumption.
 * 
 * @param {Payload} payload - The payload containing user and route data.
 * @returns {object} The restructured data containing activity, activityRoute, activityTags, and dalleUrl.
 */
export const restructureRideData = (payload: Payload) => {
    const { user, routeData } = payload;
    const { userID } = user?.userProfile ?? {};
    const currentDate = new Date();

    return {
        activity: {
            activityID: routeData?.activityID,
            activityTypeID: Number(routeData?.rideType),
            userID,
            activityName: routeData?.rideName,
            startName: routeData?.startName || '',
            createdBy: routeData?.createdBy || userID,
            startW3W: routeData?.startW3W || null,
            activityDate: routeData?.startDate ? format(routeData?.startDate, 'yyyy-MM-dd') : null,
            activityStartTime: routeData?.startTime ? format(routeData?.startTime, 'hh:mm:ss') : null,
            activityEndTime: routeData?.endTime ? format(routeData?.endTime, 'hh:mm:ss') : null,
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
            parentActivityID: Number(routeData?.parentActivityID) || 0,
            teamID: Number(routeData?.hubID) || 0,
            isDeleted: routeData?.isDeleted || false,
        },
        activityRoute: [
            {
                routeName: routeData?.routeName?.replace('/', '_').replace(' ', '_') ||
                    routeData?.rideName?.replace('/', '_').replace(' ', '_'),
                mapSourceID: Number(routeData?.mapSourceID),
                isPrimary: true,
                difficultyLevelID: Number(routeData?.difficulty),
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

/**
 * Determines the map source ID based on the URL provided.
 * 
 * @param {string | null | undefined} url - The URL of the map or GPX file.
 * @returns {object} An object containing the mapSourceID.
 */
export const getMapSourceID = (url: string | null | undefined): { mapSourceID: number } => {
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

/**
 * Saves the ride by dispatching necessary API calls for uploading files, adding the ride, and processing geoJSON or GPX files.
 * 
 * @param {function} dispatch - Redux dispatch function to trigger actions.
 * @param {function} onSuccess - Callback function to execute upon successful ride creation.
 * @param {function} onError - Callback function to execute in case of an error.
 * @param {object} payload - The payload containing ride data and user information.
 */
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
            const pdfBinary = await fileToBase64(routeData?.document) as string;
            routeData.HasWaiver = true;
            fileUploadModelBinary.push({
                activityID,
                fileUploadTypeID: 2,
                uploadedFile: pdfBinary,
            });
        }

        if (activityID && routeData?.image) {
            const imageBinary = await fileToBase64(routeData?.image) as string;
            fileUploadModelBinary.push({
                activityID,
                fileUploadTypeID: 1,
                uploadedFile: imageBinary,
            });
        }

        if (activityID && routeData?.geoJSON?.features) {
            try {
                const jsonString = JSON.stringify(routeData.geoJSON, null, 2);
                const geoBinary = btoa(jsonString);
                fileUploadModelBinary?.push({
                    activityID: activityID,
                    fileUploadTypeID: 4,
                    uploadedFile: geoBinary,
                });
            } catch (error) {
                console.error(error);
            }
        }

        if (activityID && routeData?.gpxFilePath) {
            try {
                let trimmedPathname = routeData?.gpxFilePath?.replace(/\.gpx$/, '');
                const response = await fetch(decodeURI(trimmedPathname));
                if (!response.ok) {
                    throw new Error(`Failed to load GPX file: ${response.statusText}`);
                }
                const arrayBuffer = await response.arrayBuffer();

                const uint8Array = new Uint8Array(arrayBuffer);
                const base64String = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');

                fileUploadModelBinary?.push({
                    activityID: activityID,
                    fileUploadTypeID: 3,
                    uploadedFile: btoa(base64String),
                });
            } catch (error) {
                console.error(error);
            }
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
            FileUploads: fileupload?.payload ? fileupload?.payload : null,
            AcivityRoute: activityRoute,
            ActivityTags: activityTags,
            DalleUrl: dalleUrl,
        };

        const response = await dispatch(addRide(activityConsolidatedPayload));
        if(addRide.fulfilled.match(response)){
            onSuccess(response);
        }
    } catch (error: any) {
        onError(error.message || '');
        console.error(error)
    }
}
