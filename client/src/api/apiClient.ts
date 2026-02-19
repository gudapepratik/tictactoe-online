import axios from "axios"
import { ENVARS } from "../utils/envConfig"

export const api = axios.create({
  baseURL: ENVARS.BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
})