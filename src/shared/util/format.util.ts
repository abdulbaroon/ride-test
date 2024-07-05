export const extractRouteId = (url: string) => {
    const regex = /\/routes\/(\d+)/
    const match = url?.match(regex)
  
    if (match && match[1]) {
      return match[1]
    } else {
      return null
    }
  }

  export const readFileAsBase64 = (filePath: File | any): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(filePath);
  
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
  
      reader.onerror = (error) => reject(error);
    });
  };
  