import React from 'react';
import { FieldErrors } from 'react-hook-form';
import { FileUploader } from 'react-drag-drop-files';

interface GPXFileUploaderProps {
  handleFile: (file: File) => void;
  errors: FieldErrors;
}

const GPXFileUploader: React.FC<GPXFileUploaderProps> = ({ handleFile, errors }) => (
  <div className="my-10 shadow-xl rounded-xl p-5 w-full">
    <FileUploader
      handleChange={handleFile}
      name="file"
      types={["GPX", "GPS"]}
      classes="fileUploader"
      multiple={false}
      label="Select or drag & drop your gpx file here!"
    />
    {errors?.gpxFile && (
      <p className="text-xs mt-1 text-red-600">{errors?.gpxFile.message as string}</p>
    )}
  </div>
);

export default GPXFileUploader;
