
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

// export function convertToBase64(file: File): Promise<string | null> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();

//     reader.onload = () => {
//       const result = reader.result as string;
//       const base64String = result.split(',')[1];
//       resolve(base64String);
//     };

//     reader.onerror = (error) => {
//       console.error('Error reading file:', error);
//       reject(error);
//     };

//     reader.readAsDataURL(gpxFile);
//   });
// }

// export const handleConvertToBase64 = async (file: File): Promise<string | null> => {
//   try {
//     if (file) {
//       return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           const base64String = e.target?.result as string;
//           resolve(base64String);
//         };
//         reader.onerror = (err) => {
//           reject(err);
//         };
//         reader.readAsDataURL(file);
//       });
//     } else {
//       throw new Error('Please select a file.');
//     }
//   } catch (err) {
//     console.error(err);
//     throw err; // Propagate the error to the caller
//   }
// };


export function fileToBase64(file:File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
      } else {
          reject(new Error("Reader result is not a string"));
      }
  };
    
    reader.onerror = error => reject(error);
    
    reader.readAsDataURL(file);
  });
}



  
