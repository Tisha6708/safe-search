import api from "./api";
import { handleApiError } from "../utils/errorHandler";

export async function uploadDocument(data) {
  try {
    const res = await api.post("/api/upload/", data);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
}