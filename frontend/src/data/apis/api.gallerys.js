import {API_BASE_URL,VITE_ADMIN_API_KEY} from "./config";

const getAuthHeaders = () => {
  // Use your admin API key string here
  if(VITE_ADMIN_API_KEY === null){
    throw new Error("Admin key is required");
  }
  return {
    Authorization: `Bearer ${VITE_ADMIN_API_KEY}`,
  };
};

export const fetchGalleryImages = async () => {
  const response = await fetch(`${API_BASE_URL}/gallery`);
  if (!response.ok) throw new Error("Failed to fetch gallery images");
  return response.json();
};

export const uploadGalleryImage = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/gallery`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to upload image");
  }
  return response.json();
};

export const deleteGalleryImage = async (id) => {
  const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete image");
  }

  // Handle 204 No Content without trying to parse JSON
  if (response.status === 204) {
    return { success: true };
  }

  return response.json();
};
