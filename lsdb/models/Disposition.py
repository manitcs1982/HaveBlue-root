from django.db import models

class Disposition(models.Model):
    name = models.CharField(db_index=True, unique=True, max_length=32, blank=False, null=False)
    description = models.CharField(max_length=128, blank=True, null=True)
    complete = models.BooleanField(default=False, null=False, blank=False)

    class Meta:
        ordering = ('name',)

    def __str__(self):
        return "{}".format(self.name)
