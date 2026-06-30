// src/Services/uploadApi.js
import axios from "axios";

export const UploadImage = async (file) => {
  try {
    // Axios secara otomatis menyusun boundary multipart/form-data jika menggunakan FormData
    const formData = new FormData();
    formData.append("file", file); 

    const response = await axios.post(
      "https://bucket.mgentaarya.my.id/uploads.php",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          genta: "Genta@456",
        },
      }
    );
    
    // Berdasarkan payload response: response.data.file_url
    return response.data; 
  } catch (error) {
    console.error("Gagal mengunggah file ke bucket external:", error);
    throw error;
  }
};