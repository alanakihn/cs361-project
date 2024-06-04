import axios from "axios";

interface UploadImageId {
  message: string,
  id: string,
}
const uploadImage = async (token: string, image: File): Promise<UploadImageId | null> => {
  const imagesEndpoint = import.meta.env.VITE_IMAGES_MIDDLEWARE;
  const formData = new FormData();
  formData.append('image', image);

  try {
    const response = await axios.post<UploadImageId>(`${imagesEndpoint}/image?token=${token}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;

  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export {
  uploadImage,
}

export type {
  UploadImageId
}
