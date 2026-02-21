import api from "./api";
import { handleApiError } from "../utils/errorHandler";
import {
  normalizeKeyword,
  sha256Hex,
  signHashHex
} from "../utils/crypto";

export async function externalSearch(keyword, privateKey) {
  try {
    const normalized = normalizeKeyword(keyword);
    const keywordHash = await sha256Hex(normalized);
    const signature = await signHashHex(keywordHash, privateKey);

    const payload = {
      auditor_id: 1,
      keyword_hash: keywordHash,
      signature: signature
    };

    const res = await api.post("/api/search/external/", payload);
    return res.data;

  } catch (err) {
    throw handleApiError(err);
  }
}