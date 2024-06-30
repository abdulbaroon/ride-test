export interface UploadFile {
    fileUploadModelBinary: FileUploadModelBinaryItem[];
}

export interface FileUploadModelBinaryItem {
    uploadedFile: string;
    activityID: number; 
    fileUploadTypeID: number;
}
