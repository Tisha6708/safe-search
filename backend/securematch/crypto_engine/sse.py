# crypto_engine/sse.py

import os
import json
import hmac
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from .key_manager import load_master_key, derive_keys


# Load and derive once
_master = load_master_key()
AES_KEY, HMAC_KEY = derive_keys(_master)


# ---------------------------
# AES-256-GCM
# ---------------------------

def encrypt_document(data: dict) -> dict:
    """
    Encrypt a dictionary using AES-256-GCM.
    Returns nonce + ciphertext.
    """

    aesgcm = AESGCM(AES_KEY)

    nonce = os.urandom(12)  # 96-bit nonce (required for GCM)

    plaintext = json.dumps(data).encode()

    ciphertext = aesgcm.encrypt(nonce, plaintext, None)

    return {
        "nonce": nonce.hex(),
        "ciphertext": ciphertext.hex()
    }


def decrypt_document(encrypted_data: dict) -> dict:
    """
    Decrypt AES-256-GCM encrypted document.
    """

    aesgcm = AESGCM(AES_KEY)

    nonce = bytes.fromhex(encrypted_data["nonce"])
    ciphertext = bytes.fromhex(encrypted_data["ciphertext"])

    plaintext = aesgcm.decrypt(nonce, ciphertext, None)

    return json.loads(plaintext.decode())


# ---------------------------
# HMAC Tokenization (Field-Bound)
# ---------------------------

def normalize(text: str) -> str:
    return text.strip().lower()


def generate_token(field: str, value: str) -> str:
    """
    Deterministic field-bound HMAC-SHA256 token.
    Used during indexing.
    """

    normalized_value = normalize(value)
    payload = f"{field}:{normalized_value}"

    digest = hmac.new(
        HMAC_KEY,
        payload.encode(),
        hashlib.sha256
    ).hexdigest()

    return digest


def generate_trapdoor(field: str, value: str) -> str:
    """
    Same logic as token.
    Used during search.
    """
    return generate_token(field, value)