import { fileToBase64 } from '@/shared/util/format.util';
import { getMapSourceID, restructureRideData } from '../../addRide/feature/rideFeature';
import { isEmpty, isObject, isString } from 'lodash';
import { uploadedFile } from '@/redux/slices/authSlice';
import { editRideApi } from '@/redux/slices/addRideSlice';

const getMapSource = (tabid: number, url: string) => {
  if (tabid === 1) {
    return 5;
  } else if (tabid === 2) {
    return 4;
  } else if (tabid === 0) {
    if (url?.includes("strava.com")) {
      return 2;
    } else if (url?.includes("connect.garmin.com")) {
      return 3;
    } else if (url?.includes("ridewithgps.com")) {
      return 1;
    }
  }
};
export const editRide = async (
  dispatch: any,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  payload: any
) => {

  const processFileUpload = async (routeData: any, fileUploadModelBinary: any[]) => {

    if (
      routeData?.activityID &&
      !isString(routeData?.document) &&
      (routeData?.document)
    ) {
      try {
        const pdfBinary = await fileToBase64(routeData?.document) as string;
        routeData.HasWaiver = true;
        fileUploadModelBinary.push({
          activityID: routeData?.activityID,
          fileUploadTypeID: 2,
          uploadedFile: pdfBinary,
        });
      } catch (error) {
        console.error('Error converting document to base64', error);
      }
    }

    if (
      routeData?.activityID &&
      !isString(routeData?.image) &&
      routeData?.image
    ) {
      try {
        const imageBinary = await fileToBase64(routeData?.image) as string;
        fileUploadModelBinary.push({
          activityID: routeData?.activityID,
          fileUploadTypeID: 1,
          uploadedFile: imageBinary,
        });
      } catch (error) {
        console.error('Error converting image to base64', error);
      }
    }

    if (routeData?.activityID && !isEmpty(routeData?.geoJSON)) {
      try {
        const jsonString = JSON.stringify(routeData.geoJSON, null, 2);
        const geoBinary = btoa(jsonString);
        fileUploadModelBinary.push({
          activityID: routeData?.activityID,
          fileUploadTypeID: 4,
          uploadedFile: geoBinary,
        });
      } catch (error) {
        console.error('Error converting geoJSON to base64', error);
      }
    }

    
    if (routeData?.activityID && routeData?.gpxFilePath) {
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
              activityID:routeData?.activityID,
              fileUploadTypeID: 3,
              uploadedFile: btoa(base64String),
          });
      } catch (error) {
          console.error(error);
      }
  }
  };

  try {
    const { routeData, user } = payload;
    const  mapSourceID  = getMapSource(routeData?.currentTab,routeData?.url);

    const fileUploadModelBinary:[] = [];
    await processFileUpload(routeData, fileUploadModelBinary);

    let fileupload = null;
    if (fileUploadModelBinary.length > 0) {
      try {
        const filePayload = { fileUploadModelBinary };
        const data = await dispatch(uploadedFile(filePayload));
        fileupload = data || null;
      } catch (error) {
        console.error('Error uploading files', error);
      }
    }

    const { activity, activityRoute, activityTags, dalleUrl } = restructureRideData({
      routeData: { mapSourceID, ...routeData },
      user,
    });

    const activityConsolidatedPayload = {
      Activity: activity,
      FileUploads: fileupload?.payload || null,
      ActivityRoute: activityRoute,
      ActivityTags: activityTags,
      DalleUrl: dalleUrl,
    };

    const response = await dispatch(editRideApi(activityConsolidatedPayload));
    if(editRideApi.fulfilled.match(response)){
      onSuccess(response.payload || {});
  }
  } catch (error:any) {
    console.error('Error in editRide', error);
    onError(error.message || '');
  }
};
