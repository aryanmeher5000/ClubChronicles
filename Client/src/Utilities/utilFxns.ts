export function readableDate(inpDate: Date | string | number, includeTime: boolean = true): string {
  // Ensure the input is properly converted to a Date object
  const date = new Date(inpDate);

  // Check if the input date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  // Date format options, with optional time display
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(includeTime && { hour: "numeric", minute: "numeric" }), // Conditionally add time
  };

  return date.toLocaleString("en-US", options);
}

export const convertToFormData = (normalObj: any) => {
  const formData = new FormData();
  const keyWords = ["pdf", "image", "logo", "profilePic", "images", "pdfs", "photo", "timeTable", "teamPic"];
  const keysOfObj = Object.keys(normalObj);

  keysOfObj.forEach((k) => {
    const value = normalObj[k];

    if (keyWords.includes(k)) {
      if (Array.isArray(value)) {
        // If value is an array, append each element
        value.forEach((item) => {
          if (item instanceof File || item instanceof Blob) {
            formData.append(k, item);
          } else {
            console.error(`Expected file for key ${k}, but got:`, item);
          }
        });
      } else if (value instanceof FileList) {
        // Handle FileList
        for (let i = 0; i < value.length; i++) {
          formData.append(k, value[i]);
        }
      } else if (value instanceof File || value instanceof Blob) {
        formData.append(k, value);
      }
    } else {
      // Handle non-file fields
      if (typeof value === "object" && value !== null) {
        formData.append(k, JSON.stringify(value));
      } else {
        formData.append(k, value);
      }
    }
  });

  return formData;
};

export const createImageUrlFromId = (id?: string) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${id ? id : "v1737039284/default-fallback-image_xsgfbh.png"}`;
};
