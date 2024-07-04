"use client"
import React, { useState } from 'react';
import useGpxToGeoJson from '@/shared/hook/useGpxToGeoJson';

const GpxUploader: React.FC = () => {
  const {
    handlePickDocument,
    handleDownloadUrl,
    handleDownloadGPXFile,
    fetchAndOpenUrl,
    getBoundingBox,
    centerLatitude,
    centerLongitude,
    routeDistance,
    geoJSON,
    gpxFilePath,
    loading,
    error,
    errorMessage,
  } = useGpxToGeoJson();

  const [url, setUrl] = useState<string>('');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <div>
      <h1>GPX Uploader</h1>
      <div>
        {/* <input type="file" accept=".gpx" onChange={handlePickDocument} /> */}
      </div>
      <div>
        <input type="text" value={url} onChange={handleUrlChange} placeholder="Enter GPX file URL" />
        <button onClick={() => handleDownloadUrl(url)}>Download GPX from URL</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {errorMessage}</p>}
      {geoJSON && (
        <div>
          <p>Route Distance: {routeDistance} miles</p>
          <p>Center Latitude: {centerLatitude}</p>
          <p>Center Longitude: {centerLongitude}</p>
          <p>File Path: {gpxFilePath}</p>
        </div>
      )}
    </div>
  );
};

export default GpxUploader;
