const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

const VITE_ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY || null;
if(VITE_ADMIN_API_KEY === null){
    throw new Error("Admin key is required");
}
export { API_BASE_URL,VITE_ADMIN_API_KEY};

