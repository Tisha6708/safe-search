import api from "./api";
import { handleApiError } from "../utils/errorHandler";

export async function rotateAuditorKey(auditorId) {
  try {
    const res = await api.post("/api/auditor/rotate-key/", {
      auditor_id: auditorId
    });
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function getAuditorLogs(auditorId) {
  try {
    const res = await api.get(`/api/auditor/${auditorId}/logs/`);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
}