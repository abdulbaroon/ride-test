export const extractRouteId = (url: string) => {
    const regex = /\/routes\/(\d+)/
    const match = url?.match(regex)
  
    if (match && match[1]) {
      return match[1]
    } else {
      return null
    }
  }

  export const readFileAsBase64 = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const reader = new FileReader();
            reader.onloadend = function () {
                // Assuming the result is a Data URL, split it and take the base64 part
                const base64Part = reader?.result ? (reader.result as string).split(',')[1] : '';
                resolve(base64Part);
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = function (error) {
            reject(error);
        };
        xhr.open('GET', filePath);
        xhr.responseType = 'blob';
        xhr.send();
    });
};

  
