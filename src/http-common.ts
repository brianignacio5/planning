import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "localhost";
const backendPort = import.meta.env.VITE_BACKEND_PORT || "3000";
export default axios.create({
  baseURL: `http://${backendUrl}:${backendPort}`,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});
