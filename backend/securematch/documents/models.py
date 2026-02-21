from django.db import models


class EncryptedDocument(models.Model):
    encrypted_blob = models.JSONField()  # contains nonce + ciphertext
    created_at = models.DateTimeField(auto_now_add=True)


class SearchTokenIndex(models.Model):
    token = models.CharField(max_length=64, db_index=True)
    document = models.ForeignKey(
        EncryptedDocument,
        on_delete=models.CASCADE,
        related_name="tokens"
    )

    class Meta:
        indexes = [
            models.Index(fields=["token"]),
        ]