import json
from django.core.management.base import BaseCommand
from api.models import Vulnerability  # Replace "api" with your app's actual name if different

class Command(BaseCommand):
    print("im here")
    help = "Load vulnerabilities from JSON data"

    def handle(self, *args, **kwargs):
        with open('api/management/commands/vulnerabilities.json', 'r') as file:
            print('lets go gogogogogo')
            data = json.load(file)
            for item in data:
                max_cvss = None if item["Max CVSS"] == "N/A" else item["Max CVSS"]
                Vulnerability.objects.create(
                    code_cve=item["Code CVE"],
                    max_cvss=max_cvss,
                    type_vulnerability=item["Type Vulnerability"],
                    date=item["Date"],
                    source=item["Source"],
                    lien=item["Lien"],
                    resume=item["Resume"],
                    lien_article=item.get("Lien Article", None),
                    resume_article=item.get("Resume de l'article", None)
                )
        self.stdout.write(self.style.SUCCESS("Data loaded successfully."))
