// src/utils/crypto.js

// ---------- Helper: Convert ArrayBuffer to Hex ----------
function bufferToHex(buffer) {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// ---------- Helper: Convert PEM to ArrayBuffer ----------
function pemToArrayBuffer(pem) {
  const base64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");

  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);

  for (let i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i);
  }

  return buffer;
}

// ---------- 1️⃣ Normalize Keyword ----------
export function normalizeKeyword(keyword) {
  return keyword.trim().toLowerCase();
}

// ---------- 2️⃣ SHA256 Hash ----------
export async function sha256Hex(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return bufferToHex(hashBuffer);
}

// ---------- 3️⃣ Import RSA Private Key ----------
async function importPrivateKey(pemKey) {
  const keyBuffer = pemToArrayBuffer(pemKey);

  return await crypto.subtle.importKey(
    "pkcs8",
    keyBuffer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256"
    },
    false,
    ["sign"]
  );
}

// ---------- 4️⃣ Sign Hash ----------
export async function signHashHex(hashHex, pemPrivateKey) {
  const privateKey = await importPrivateKey(pemPrivateKey);

  const encoder = new TextEncoder();
  const data = encoder.encode(hashHex);

  const signatureBuffer = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    data
  );

  return bufferToHex(signatureBuffer);
}