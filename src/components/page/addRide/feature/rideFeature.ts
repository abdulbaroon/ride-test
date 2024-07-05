import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { RouteData } from '@/shared/types/addRide.types';
import { readFileAsBase64 } from '@/shared/util/format.util';
import { api } from '@/shared/api';
import { uploadedFile } from '@/redux/slices/authSlice';



interface UserProfile {
    userID: string;
}

interface Payload {
    user?: { userProfile?: UserProfile };
    routeData?: RouteData;
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
            activityStartTime: dayjs(routeData?.startTime).format('HH:mm:ss'),
            activityEndTime: dayjs(routeData?.endTime).format('HH:mm:ss'),
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
            hasWaiver: routeData?.HasWaiver || false,
            parentActivityID: routeData?.parentActivityID || 0,
            teamID: routeData?.teamID || 0,
            isDeleted: routeData?.isDeleted || false,
        },
        activityRoute: [
            {
                routeName: routeData?.routeName?.replace('/', '_').replace(' ', '_') ||
                    routeData?.rideName?.replace('/', '_').replace(' ', '_'),
                mapSourceID: routeData?.mapSourceID,
                isPrimary: true,
                difficultyLevelID: routeData?.difficultyLevelID,
                distance: Number(routeData?.distance),
                speed: Number(routeData?.avgSpeed),
                routeNumber: routeData?.routeNumber ?? null,
                mapUrl: routeData?.mapUrl ?? null,
            },
        ],
        activityTags: routeData?.tags?.map((item: string) => item) || [],
        dalleUrl: routeData?.dalleUrl || null,
    };
}

const getMapSourceID = (url: string | null | undefined) => {
    if (url?.includes('ridewithgps.com')) {
        return { mapSourceID: 1 };
    } else if (url?.includes('strava.com')) {
        return { mapSourceID: 2 };
    } else if (url?.includes('connect.garmin.com')) {
        return { mapSourceID: 3 };
    } else if (url?.endsWith('.gpx') || url?.endsWith('.jpx')) {
        return { mapSourceID: 5 };
    } else {
        return { mapSourceID: 4 }; // no route!
    }
}

export const saveRide = async (
    dispatch: any,
    onSuccess: (response: any) => void,
    onError: (error: any) => void,
    payload: Payload
) => {
    try {
        const fileUploadModelBinary: Array<any> = [];
        let activityID: number | null = null;
        let fileupload = null;

        dispatch({ type: 'ACTIVITY_REQUEST' });

        const { routeData, user } = payload;
        const { mapSourceID } = getMapSourceID(routeData?.mapUrl || routeData?.gpxFilePath);

        // const routeRepo = RouteRepository.getInstance();
        const res = await api.get(`/activity/${user?.userProfile?.userID}/nextid`);

        if (res?.data) {
            activityID = res?.data?.activityID;
        }

        if (activityID && routeData?.document?.uri) {
            const pdfBinary = await readFileAsBase64(routeData?.document?.uri);
            routeData.HasWaiver = true;
            fileUploadModelBinary.push({
                activityID,
                fileUploadTypeID: 2,
                uploadedFile: pdfBinary,
            });
        } else {
            routeData
            if (activityID && routeData?.image?.path) {
                const imageBinary = await readFileAsBase64(routeData?.image?.path);
                fileUploadModelBinary.push({
                    activityID,
                    fileUploadTypeID: 1,
                    uploadedFile: imageBinary,
                });
            }

            if (activityID && routeData?.geoJSON) {
                const geoBinary = btoa(JSON.stringify(routeData?.geoJSON));
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
                FileUploads: fileupload || null,
                AcivityRoute: activityRoute,
                ActivityTags: activityTags,
                DalleUrl: dalleUrl,
            };

            // const response = await routeRepo.saveActivity(activityConsolidatedPayload);
            const response = activityConsolidatedPayload


            const document = response?.hasWaiver
                ? {
                    uri: `/ridewaivers/ridewaiver_${response.activityID}.pdf`,
                    name: `${response.activityID}.pdf`,
                }
                : null;

            await dispatch({ type: 'SET_ROUTE_DATA', payload: { activityID, mapSourceID, document } });
            dispatch({ type: 'ACTIVITY_SUCCESS' });
            onSuccess(response || {});
        } catch (error) {
            dispatch({ type: 'ACTIVITY_FAIL', payload: error.message || '' });
            onError(error.message || '');
        }
    }

// export const editRide = async (
//   dispatch: any,
//   onSuccess: (response: any) => void,
//   onError: (error: any) => void,
//   payload: Payload
// ) => {
//   const fileUploadModelBinary: Array<any> = [];
//   let fileupload = null;

//   try {
//     dispatch({ type: 'UPDATE_ACTIVITY_REQUEST' });

//     const { routeData, user } = payload;
//     const { mapSourceID } = getMapSourceID(routeData?.mapUrl || routeData?.gpxFilePath);

//     const routeRepo = RouteRepository.getInstance();

//     if (routeData?.activityID && routeData?.document?.uri && !routeData?.document?.uri.startsWith('https://')) {
//       const pdfBinary = await readFileAsBase64(routeData?.document?.uri);
//       routeData.HasWaiver = true;
//       fileUploadModelBinary.push({
//         activityID: routeData?.activityID,
//         fileUploadTypeID: 2,
//         uploadedFile: pdfBinary,
//       });
//     }

//     if (routeData?.activityID && routeData?.image?.path && !routeData?.image?.path.startsWith('https://')) {
//       const imageBinary = await readFileAsBase64(routeData?.image?.path);
//       fileUploadModelBinary.push({
//         activityID: routeData?.activityID,
//         fileUploadTypeID: 1,
//         uploadedFile: imageBinary,
//       });
//     }

//     if (routeData?.activityID && routeData?.geoJSON) {
//       const geoBinary = btoa(JSON.stringify(routeData?.geoJSON));
//       fileUploadModelBinary.push({
//         activityID: routeData?.activityID,
//         fileUploadTypeID: 4,
//         uploadedFile: geoBinary,
//       });
//     }

//     if (routeData?.activityID && routeData?.gpxFilePath) {
//       const gpxBinary = await readFileAsBase64(routeData?.gpxFilePath);
//       fileUploadModelBinary.push({
//         activityID: routeData?.activityID,
//         fileUploadTypeID: 3,
//         uploadedFile: gpxBinary,
//       });
//     }

//     if (fileUploadModelBinary.length > 0) {
//       const filePayload = { fileUploadModelBinary };
//       const data = await routeRepo.uploadFiles(filePayload);
//       fileupload = data || null;
//     }

//     const { activity, activityRoute, activityTags, dalleUrl } = restructureRideData({
//       routeData: { mapSourceID, ...routeData },
//       user,
//     });

//     const dataBody = {
//       Activity: activity,
//       FileUploads: fileupload || null,
//       ActivityRoute: activityRoute,
//       ActivityTags: activityTags || null,
//       DalleUrl: dalleUrl || null,
//     };

//     const data = await routeRepo.updateActivity(dataBody);
//     dispatch({ type: 'UPDATE_ACTIVITY_SUCCESS' });
//     onSuccess(data || {});
//   } catch (error) {
//     dispatch({ type: 'UPDATE_ACTIVITY_FAIL', payload: error.message || '' });
//     onError(error.message || '');
//   }
// }
