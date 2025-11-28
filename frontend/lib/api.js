import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api"
});

export default API;
