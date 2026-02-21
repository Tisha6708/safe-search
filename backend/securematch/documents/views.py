import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from crypto_engine.sse import encrypt_document, generate_token
from .models import EncryptedDocument, SearchTokenIndex
from .constants import SEARCHABLE_FIELDS


@api_view(["POST"])
def upload_document(request):
    try:
        data = request.data

        # Ensure payload is a JSON object
        if not isinstance(data, dict):
            return Response(
                {"error": "Invalid JSON object"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1️⃣ Encrypt full record
        encrypted_blob = encrypt_document(data)

        doc = EncryptedDocument.objects.create(
            encrypted_blob=encrypted_blob
        )

        # 2️⃣ Tokenize selected searchable fields
        for field in SEARCHABLE_FIELDS:
            if field in data and data[field] is not None:

                value = str(data[field]).strip()

                # Skip empty strings
                if not value:
                    continue

                token = generate_token(field, value)

                SearchTokenIndex.objects.create(
                    token=token,
                    document=doc
                )

        return Response(
            {"message": "Document encrypted and indexed"},
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {"error": "Upload failed"},
            status=status.HTTP_400_BAD_REQUEST
        )