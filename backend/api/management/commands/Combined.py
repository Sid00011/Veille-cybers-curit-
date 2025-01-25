import requests
import cloudscraper
from bs4 import BeautifulSoup
import os
import platform
import subprocess
import sys
import time
import re
import json
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
# Fonction pour installer les packages manquants
def install_package(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

# Liste des modules nécessaires
required_packages = [
    'cloudscraper',
    'beautifulsoup4'
]

# Vérifier et installer les modules manquants
for package in required_packages:
    try:
        __import__(package)
    except ImportError:
        print(f"Le package {package} n'est pas installé. Installation en cours...")
        install_package(package)
    else:
        print(f"Le package {package} est déjà installé.")

# Liste des URLs à scraper
date=2025
urls = [
    f"https://www.cvedetails.com/vulnerability-list/year-{date}/vulnerabilities.html?page="
]

# Définir un agent utilisateur
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}
scraper = cloudscraper.create_scraper()

# Fonction pour récupérer le texte de l'article complet
def fetch_full_article(link):
    try:
        response = scraper.get(link, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')

            # Supprimer les éléments indésirables (images, scripts, styles, etc.)
            for element in soup(['img', 'a', 'script', 'style', 'footer', 'nav', 'header', 'aside', 'iframe']):
                element.decompose()

            # Extraire uniquement le texte pertinent (les paragraphes)
            paragraphs = soup.find_all('p')
            full_text = '\n'.join(p.get_text(strip=True) for p in paragraphs)

            return full_text if full_text else "Contenu complet non disponible."
        else:
            return "Échec de la récupération du contenu."
    except Exception as e:
        return f"Erreur lors de la récupération de l'article: {e}"

# Fonction pour tenter plusieurs fois de récupérer une page
def get_page_with_retries(url, retries=2, delay=1):
    for attempt in range(retries):
        try:
            response = scraper.get(url, headers=headers)
            if response.status_code == 200:
                return response
            else:
                print(
                    f"Échec de la récupération de {url} (code de statut: {response.status_code}). Tentative {attempt + 1}/{retries}.")
        except requests.RequestException as e:
            print(f"Erreur de connexion pour {url}: {e}. Tentative {attempt + 1}/{retries}.")

        if attempt < retries - 1:
            time.sleep(delay)  # Attendre avant de réessayer
        else:
            print(f"Échec de la récupération après {retries} tentatives.")
    return None

# Détecter le système d'exploitation
system = platform.system()

# Déterminer le répertoire racine en fonction de l'OS
if system == "Windows":
    racine = os.environ.get('SystemDrive', 'C:') + "\\"
elif system == "Linux" or system == "Darwin":  # Darwin est pour macOS
    racine = "/"
else:
    raise Exception("Système non pris en charge")

# Spécifier le nom du nouveau dossier
nouveau_dossier = "Results_scrapping"

# Construire le chemin complet
chemin_du_dossier = os.path.dirname(os.path.abspath(__file__))

# Créer le répertoire
try:
    os.makedirs(chemin_du_dossier)
    print(f"Le répertoire '{chemin_du_dossier}' a été créé avec succès.")
except FileExistsError:
    print(f"Le répertoire '{chemin_du_dossier}' existe déjà.")
except PermissionError:
    print("Vous n'avez pas la permission de créer un dossier à cet endroit.")
except Exception as e:
    print(f"Une erreur est survenue : {e}")

# Fonction pour vérifier les doublons dans le fichier
def check_duplicate(title, summary, link, file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            # Vérifier si le titre, le résumé ou le lien existent déjà dans le fichier
            if title in content or summary in content or link in content:
                return True
    except FileNotFoundError:
        return False  # Si le fichier n'existe pas, il n'y a pas de doublons
    return False

# Fonction pour extraire les informations supplémentaires (CVE, date, criticité)
def extract_additional_info(soup):
    try:
        # Extraction de la date de publication
        date = soup.find('time') or soup.find('span', class_='date')
        date_text = date.get_text(strip=True) if date else 'Date inconnue'

        # Extraction du CVE ID (s'il est mentionné)
        cve_id = re.findall(r'CVE-\d{4}-\d{4,7}', soup.get_text())
        cve_text = cve_id[0] if cve_id else 'CVE non mentionné'

        # Criticité (chercher des termes de gravité comme Critical, High, Medium, Low)
        severity = re.findall(r'(Critical|High|Medium|Low)', soup.get_text(), re.IGNORECASE)
        severity_text = severity[0] if severity else 'Gravité non mentionnée'

        return date_text, cve_text, severity_text
    except Exception as e:
        return 'Date inconnue', 'CVE non mentionné', 'Gravité non mentionnée'

def format_date(raw_date):
    return re.sub(r"\\n|\\t|Published", "", raw_date).strip()

def scrapping(page):
    # Écrire les résultats dans les fichiers
    with open(f"{os.path.join(chemin_du_dossier)}/Results.txt", "w", encoding="utf-8") as f, \
         open(f"{os.path.join(chemin_du_dossier)}/Results.json", "w", encoding="utf-8") as json_file:

        json_data = []

        print("\nScraping des sites...\n")
        for url in urls:
            for x in range(1,page+1):
                print(f'--------------------------------------- Scraping de {f"{url}{x}&order=1"} --------------------------------------')

                # Essayer de récupérer la page avec des tentatives en cas d'échec
                response = get_page_with_retries(f"{url}{x}&order=1")

                if response:
                    soup = BeautifulSoup(response.content, 'html.parser')

                    articles = soup.find_all('div', class_="border-top py-3 px-2 hover-bg-light")
                    for article in articles:
                        title = article.find("div",class_="row").find("a",href=True).text.strip()
                        sum = article.find("div",class_="cvesummarylong py-0").text
                        maxcvss = article.find("div",class_="col-md-3").find("div",class_="row mb-1").find("div",{'data-tsvfield': 'maxCvssBaseScore'}).find("div").text
                        epss = article.find("div",class_="col-md-3").find("div",{'data-tsvfield':'epssScore'}).find("span").text

                        print("-------------------------------------------------------------------------------")
                        print("Titre:", title)
                        print("Resume:", sum)
                        print("Max cvss:", maxcvss)
                        print("EPSS:", epss)

                        response2 = get_page_with_retries(f"https://www.cvedetails.com/cve/{title}")
                        soup2 = BeautifulSoup(response2.content, 'html.parser')
                        articlesvul = soup2.find("div", {"id":"contentdiv"}).find("div",class_="p-0 pe-2").find("div",class_="p-0 m-0").find("div",{"id":"cve_catslabelsnotes_div"}).find("div",class_="col-auto flex-fill pt-2").find("span",class_="ssc-vuln-cat")
                        vulnerability = "Not defined"
                        if articlesvul is not None:
                            vulnerability = articlesvul.text.strip()

                        raw_date = soup2.find("div", {"id": "contentdiv"}).find("div", class_="p-0 pe-2").find("div", class_="p-0 m-0").find("div",class_="row").find("div",class_="col-auto flex-fill").find("div").text.strip()
                        date = format_date(raw_date)
                        print("Date", date)

                        source = soup2.find("div", {"id": "contentdiv"}).find("div", class_="p-0 pe-2").find("div", class_="p-0 m-0").find("div",class_="row").find("div",class_="col-auto flex-fill").find_all("div")
                        for src in source:
                            sfnsource = src.find("a")
                            if sfnsource is not None:
                                sfnsource = sfnsource.text

                        print("Source:", sfnsource)
                        print(f"Lien:https://www.cvedetails.com/cve/{title}")

                        f.write("-----------------------------------------------------------------------------\n")
                        f.write(f"Code CVE:{title}\n")
                        f.write(f"Resume:{sum}\n")
                        f.write(f"Max cvss:{maxcvss}\n")
                        f.write(f"Epss:{epss}\n")
                        f.write(f"Vulnerability:{vulnerability}\n")
                        f.write(f"Date:{date}\n")
                        f.write(f"Source:{sfnsource}\n")
                        f.write(f"Lien:https://www.cvedetails.com/cve/{title}\n")

                        json_data.append({
                            "Code CVE": title,
                            "Resume": sum,
                            "Max CVSS": maxcvss,
                            "EPSS": epss,
                            "Vulnerability": vulnerability,
                            "Date": date,
                            "Source": sfnsource,
                            "Lien": f"https://www.cvedetails.com/cve/{title}"
                        })

        json.dump(json_data, json_file, ensure_ascii=False, indent=4)



# Get the number of pages to fetch from the user

def Scrapping_Redhat(num_pages):
    try:
        gecko_path = "C:/Webdrivers/geckodriver.exe"  # Replace with your actual GeckoDriver path

        # Configure Firefox service
        service = Service(gecko_path)
        print("booooooooooooooooo" , gecko_path)
        driver = webdriver.Firefox(service=service)
        print('booooooooooooooo2', driver)
        # Base URL with placeholder for the page number
        base_url = "https://access.redhat.com/security/security-updates/cve?q=&p={page}&sort=cve_publicDate+desc,allTitle+desc&rows=10&documentKind=Cve"
        # Initialize JSON data structure
        cve_data = []
        # Output file paths
        output_dir = os.path.dirname(os.path.abspath(__file__))  # Current script directory
        text_file_path = os.path.join(chemin_du_dossier, "cve_output.txt")
        json_file_path = os.path.join(chemin_du_dossier, "cve_output.json")
        for page in range(1, num_pages + 1):
            # Load the page with the appropriate page number
            url = base_url.format(page=page)
            print(f"Fetching data from: {url}")
            driver.get(url)

            # Wait for the table to load
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "cp-table#cve-db-table"))
            )

            # Locate all rows in the table
            table = driver.find_element(By.CSS_SELECTOR, "cp-table#cve-db-table")
            rows = table.find_elements(By.CSS_SELECTOR, "cp-tbody > cp-tr")
            print(f"Found {len(rows)} rows on page {page}.")

            with open(text_file_path, "w", encoding="utf-8") as text_file:
                for row in rows:
                    try:
                        # Extract CVE title and link
                        link_element = row.find_element(By.CSS_SELECTOR, "cp-th a")
                        link = link_element.get_attribute("href")
                        title = link_element.text.strip()

                        # Extract description
                        description = row.find_element(By.CSS_SELECTOR, "cp-td[data-label='Description']").text.strip()

                        # Extract severity
                        severity = row.find_element(By.CSS_SELECTOR, "cp-td[data-label='CVE Severity'] rh-badge").text.strip()

                        # Extract publish date
                        try:
                            shadow_host = row.find_element(By.CSS_SELECTOR, "cp-td[data-label='PublishDate'] pf-timestamp")
                            shadow_root = driver.execute_script("return arguments[0].shadowRoot", shadow_host)
                            time_element = shadow_root.find_element(By.CSS_SELECTOR, "time")
                            publish_date = time_element.get_attribute("datetime") or time_element.text.strip()
                        except Exception as e:
                            publish_date = "Not Available"

                        # Prepare CVE data entry
                        cve_entry = {
                            "link": link,
                            "title": title,
                            "description": description,
                            "severity": severity,
                            "publish_date": publish_date,
                        }
                        cve_data.append(cve_entry)

                        # Write to text file
                        text_file.write("-------------------------------------------------\n")
                        text_file.write(f"Link: {link}\n")
                        text_file.write(f"Title: {title}\n")
                        text_file.write(f"Severity: {severity}\n")
                        text_file.write(f"Publish Date: {publish_date}\n")
                        text_file.write(f"Description:\n{description}\n")
                        text_file.write("-------------------------------------------------\n")

                    except Exception as e:
                        print(f"Error processing row: {e}")

        # Write JSON data to file
        with open(json_file_path, "w", encoding="utf-8") as json_file:
            json.dump(cve_data, json_file, indent=4, ensure_ascii=False)

    finally:
        # Close the browser
        driver.quit()



# Base URL for the Rapid7 database
base_url = "https://www.rapid7.com"

# Directory to save results
output_dir = racine

# Function to scrape details from a CVE page
def scrape_cve_details(cve_url):
    response = requests.get(cve_url)
    if response.status_code != 200:
        print(f"Failed to fetch CVE details from {cve_url}")
        return {}

    soup = BeautifulSoup(response.content, 'html.parser')

    # Extract detail content
    detail_section = soup.select_one("section.vulndb__detail-wrapper")
    detail_content = detail_section.get_text(strip=True) if detail_section else "N/A"

    # Extract solutions
    solutions_section = soup.select_one("section.vulndb__references.bottom-border")
    solutions_content = solutions_section.get_text(strip=True) if solutions_section else "N/A"

    # Extract references
    references_section = soup.select_one("section.vulndb__related")
    references_content = references_section.get_text(strip=True) if references_section else "N/A"

    return {
        "detail_content": detail_content,
        "solutions": solutions_content,
        "references": references_content
    }

# Function to scrape a specific page
def scrape_page(page_url):
    response = requests.get(page_url)
    if response.status_code != 200:
        print(f"Failed to fetch {page_url}")
        return []

    soup = BeautifulSoup(response.content, 'html.parser')
    results = []

    # Find all vulnerability blocks
    vulnerabilities = soup.select("a.vulndb__result.resultblock")
    for vuln in vulnerabilities:
        try:
            # Extract the relative link to the CVE details page
            relative_url = vuln["href"]
            cve_url = f"{base_url}{relative_url}"

            # Extract title, publication date, and severity
            title = vuln.select_one(".resultblock__info-title").get_text(strip=True)
            meta_info = vuln.select_one(".resultblock__info-meta").get_text(strip=True)
            published, severity = meta_info.split(" | ")
            published_date = published.replace("Published: ", "")
            published_date=published_date.replace("\n","")
            published_date = published_date.replace("\t", "")
            published_date = published_date.replace("\r", "")
            severity_level = severity.replace("Severity: ", "")

            # Scrape additional details from the CVE page
            cve_details = scrape_cve_details(cve_url)

            # Append the data
            results.append({
                "CVE":re.findall("cve-[0-9]+-[0-9]+",cve_url)[0],
                "title": title,
                "published_date": published_date,
                "severity": severity_level,
                "cve_url": cve_url,
                **cve_details
            })

            print(f"Scraped: {title}")
        except Exception as e:
            print(f"Error processing an entry: {e}")

    return results

# Function to scrape multiple pages
def scrape_rapid7(start_page=1, end_page=1):
    all_results = []
    for page in range(start_page, end_page + 1):
        print(f"Scraping page {page}...")
        page_url = f"{base_url}/db/?q=&type=nexpose&page={page}"
        page_results = scrape_page(page_url)
        all_results.extend(page_results)

    # Save results to a JSON file
    output_file = os.path.join(chemin_du_dossier, "vulnerabilities.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=4)
    print(f"Results saved to {output_file}")

# Run the scraper


if __name__=="__main__":
    page = 2
    scrapping(page)
    Scrapping_Redhat(page)
    scrape_rapid7(1,2)