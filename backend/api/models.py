from django.db import models

class Vulnerability(models.Model):
    code_cve = models.CharField(max_length=100, unique=True)
    max_cvss = models.FloatField(null=True, blank=True)
    type_vulnerability = models.CharField(max_length=255)
    date = models.DateField()
    source = models.CharField(max_length=255)
    lien = models.URLField()
    resume = models.TextField()
    lien_article = models.URLField(null=True, blank=True)
    resume_article = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.code_cve