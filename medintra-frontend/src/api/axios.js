import axios from "axios";

const api = axios.create({
  baseURL: "https://your-backend.onrender.com/medicines"
});

export default api;
