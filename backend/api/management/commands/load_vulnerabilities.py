import json
from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from api.models import Vulnerability  # Remplacez "api" par votre nom d'application réel

class Command(BaseCommand):
    help = "Load vulnerabilities from JSON data"

    def handle(self, *args, **kwargs):
        with open('api/management/commands/vulnerabilities.json', 'r') as file:
            data = json.load(file)

            current_id = 1  # Toujours commencer à 1 si la base est vide

            for item in data:
                max_cvss = None if item["Max CVSS"] == "N/A" else item["Max CVSS"]

                try:
                    # Assigner un ID spécifique et incrémental
                    Vulnerability.objects.create(
                        id=current_id,  # Utiliser current_id au lieu de laisser Django gérer
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
                    current_id += 1  # Incrémentation manuelle de l'ID
                    
                except IntegrityError:
                    print(current_id)
                    continue  # Si erreur (contrainte UNIQUE), ignorer et passer à l'entrée suivante

        self.stdout.write(self.style.SUCCESS("Data loading completed."))
