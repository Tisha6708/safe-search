import api from "./api";
import { handleApiError } from "../utils/errorHandler";

export async function internalSearch(queryObj) {
  try {
    const res = await api.post("/api/search/internal/", queryObj);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
}