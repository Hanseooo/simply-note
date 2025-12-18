# common/models.py
import random
import string
from django.db import models

class ShareCodeMixin(models.Model):
    share_code = models.CharField(
        max_length=8,
        unique=True,
        db_index=True,
        editable=False
    )

    class Meta:
        abstract = True

    def generate_share_code(self, length=6):
        return "".join(random.choices(string.ascii_uppercase + string.digits, k=length))

    def save(self, *args, **kwargs):
        if not self.share_code:
            while True:
                code = self.generate_share_code()
                if not self.__class__.objects.filter(share_code=code).exists():
                    self.share_code = code
                    break
        super().save(*args, **kwargs)
