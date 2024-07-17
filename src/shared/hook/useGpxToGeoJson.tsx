"use client"
import { gpx } from '@tmcw/togeojson';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../api';

type TState = {
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

const useGpxToGeoJson = () => {
  const [initialState, setInitialState] = useState<TState>({
    centerLatitude: 0,
    centerLongitude: 0,
    geoJSON: {},
    gpxFilePath: '',
    routeDistance: '',
    loading: false,
    isRouteTest: false,
    url: '',
    error: false,
    errorMessage: '',
  });

  const updateState = (newState: Partial<TState>) => {
    setInitialState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  const calculateDistances = (points: [number, number][]) => {
    const distances: number[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const startLat = parseFloat(points[i][1].toString());
      const startLon = parseFloat(points[i][0].toString());
      const endLat = parseFloat(points[i + 1][1].toString());
      const endLon = parseFloat(points[i + 1][0].toString());

      const distance = haversineDistance(startLat, startLon, endLat, endLon);
      distances.push(distance);
    }
    return distances;
  };

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // In meters
    return distance;
  };

  const gpxToGeojson = ({ gpxContent }: { gpxContent: string }) => {
    const parser = new DOMParser();
    const gpxFile = parser.parseFromString(gpxContent, 'text/xml');
    const geoJSON: any = gpx(gpxFile);
    const coordinates = geoJSON?.features?.[0]?.geometry?.coordinates;
    const distances = calculateDistances(coordinates);
    const routeDistance = (
      distances.reduce((acc, cur) => acc + cur, 0) * 0.0006213712
    ).toFixed(2);

    const boundingBox = coordinates.reduce(
      (bbox: [number, number, number, number], coord: [number, number]) => {
        bbox[0] = Math.min(bbox[0], coord[0]);
        bbox[1] = Math.min(bbox[1], coord[1]);
        bbox[2] = Math.max(bbox[2], coord[0]);
        bbox[3] = Math.max(bbox[3], coord[1]);
        return bbox;
      },
      [Infinity, Infinity, -Infinity, -Infinity]
    );

    const centerLongitude = (boundingBox[0] + boundingBox[2]) / 2;
    const centerLatitude = (boundingBox[1] + boundingBox[3]) / 2;
    return {
      centerLongitude,
      centerLatitude,
      geoJSON,
      routeDistance,
    };
  };

  const handlePickDocument = async (file: File) => {
    try {
      if (file && file.name.endsWith('.gpx')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const gpxContent = e.target?.result as string;
          const { centerLatitude, centerLongitude, geoJSON, routeDistance } = await gpxToGeojson({ gpxContent });
          const features = geoJSON?.features?.[0];
          const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
          const fileURL = URL.createObjectURL(blob);
          console.log(gpxContent,"gpx")
          updateState({
            centerLatitude,
            centerLongitude,
            geoJSON,
            routeDistance,
            loading: false,
            isRouteTest: true,
            gpxFilePath: fileURL,
          });
        };
        reader.readAsText(file);
        updateState({ loading: true });
      } else {
        updateState({ loading: false });
        toast.error('Please select a GPX file.');
      }
    } catch (err) {
      updateState({ loading: false });
      console.error(err);
    }
  };

  const handleDownloadUrl = async (url?: string) => {
    if (initialState.url || url) {
      updateState({
        loading: true,
        error: false,
        errorMessage: '',
      });
      try {
        const response = await api.get('/activityroute/download_gpx', {
          params: {
            url: initialState.url || url,
          },
        });
        const { centerLatitude, centerLongitude, geoJSON, routeDistance } = gpxToGeojson({
          gpxContent: response.data,
        });
        const blob = new Blob([response.data], { type: 'application/gpx+xml' });
        const fileURL = URL.createObjectURL(blob);
        console.log(fileURL,"res")
        const features = geoJSON?.features?.[0];
        const filePath = `/${features?.properties?.name.replace('/', '_').trimEnd()}.gpx`;
        
        updateState({
          centerLongitude,
          centerLatitude,
          geoJSON,
          gpxFilePath: fileURL,
          routeDistance,
          isRouteTest: true,
          loading: false,
          error: false,
          errorMessage: '',
        });

        // Display toast message
        // toast.success('Route Imported! Your route has been imported!');
      } catch (error: any) {
        updateState({
          error: true,
          errorMessage: error.message || 'Something went wrong, please try again!',
          loading: false,
        });
      }
    } else {
      updateState({ error: true });
    }
  };

  const fetchAndOpenUrl = async (url: string, onSuccess?: () => void) => {
    try {
      if (url) {
        const supported = true; 
        if (supported) {
          window.open(url, '_blank');
          if (onSuccess) onSuccess();
        } else {
          toast.success("Don't know how to open this URL");
        }
      } else {
        toast.error('No URL found in the response');
      }
    } catch (error) {
      if (onSuccess) onSuccess();
      toast.success('Error fetching the URL');
    }
  };

  const handleDownloadGPXFile = async (url?: string, fileStorageUrl?: string, onSuccess?: () => void) => {
    if (url) {
      try {
        updateState({ loading: true });
        if (url.includes('.gpx')) {
          const response = await fetch(url);
          const gpxContent = await response.text();
          const { centerLatitude, centerLongitude, geoJSON, routeDistance } = await gpxToGeojson({ gpxContent });
          const features = geoJSON?.features?.[0];
          const file = fileStorageUrl || '';
          const filePath = `${file}/${features?.properties?.name.replace('/', '_').trimEnd()}.gpx`;
          
          updateState({
            centerLatitude,
            centerLongitude,
            geoJSON,
            routeDistance,
            loading: false,
            isRouteTest: true,
            gpxFilePath: filePath,
          });
          if (onSuccess) onSuccess();
        } else {
          updateState({ loading: false });
          console.log('Please select a GPX file.');
        }
      } catch (err) {
        updateState({ loading: false });
      }
    }
  };

  const getBoundingBox = (geoJSON: any) => {
    try {
      let minLat: number | undefined,
        maxLat: number | undefined,
        minLng: number | undefined,
        maxLng: number | undefined;

      geoJSON.features.forEach((feature: { geometry: { coordinates: [number, number][] } }) => {
        feature.geometry.coordinates.forEach(([lng, lat]) => {
          minLat = minLat !== undefined ? Math.min(lat, minLat) : lat;
          maxLat = maxLat !== undefined ? Math.max(lat, maxLat) : lat;

          minLng = minLng !== undefined ? Math.min(lng, minLng) : lng;
          maxLng = maxLng !== undefined ? Math.max(lng, maxLng) : lng;
        });
      });

      return {
        ne: [maxLng!, maxLat!],
        sw: [minLng!, minLat!],
      };
    } catch (err) {
      console.log(err);
    }
  };
  console.log(initialState,"sadf")
  return {
    handlePickDocument,
    ...initialState,
    updateState,
    features: initialState.geoJSON?.features?.[0] || {},
    handleDownloadUrl,
    handleDownloadGPXFile,
    fetchAndOpenUrl,
    getBoundingBox,
  };
};

export default useGpxToGeoJson;
