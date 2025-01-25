import json
import re

import pandas as pd
from datetime import datetime
from bs4 import BeautifulSoup
from transformers import pipeline 
import requests
# Charger les fichiers JSON
with open('cve_output.json', 'r') as file1, \
    open('vulnerabilities.json', 'r') as file2, \
    open('Results.json', 'r') as file3:
    cve_output = json.load(file1)
    vulnerabilities = json.load(file2)
    results = json.load(file3)
# Définir une wordlist étendue pour les types de vulnérabilités
wordlist = {
    "Denial of Service (DoS)": [
        "denial of service", "DoS", "resource exhaustion", "DoS attack", "service disruption"
    ],
    "End-of-Life Vulnerability": [
    "end-of-life", "EOL versions", "unpatched software", "unsupported versions",
    "outdated software", "lack of security updates"
    ],
    "Distributed Denial of Service (DDoS)": [
        "distributed denial of service", "DDoS", "botnet", "volumetric attack", "amplification attack" , "denial of service", "DoS", "service hang", "frequent crash",
    "complete denial of service", "resource exhaustion"
    ],
    "Cross Site Scripting (XSS)": [
        "cross site scripting", "XSS", "script injection", "html injection", "javascript injection",
        "stored XSS", "reflected XSS", "DOM-based XSS", "malicious script execution"
    ],
    "SQL Injection": [
        "sql injection", "SQLi", "database injection", "query manipulation", "sql command injection"
    ],
    "Remote Code Execution (RCE)": [
        "remote code execution", "code execution", "remote command execution", "remote code injection", "arbitrary code execution"
    ],
    "Privilege Escalation": [
        "privilege escalation", "elevated privileges", "root access", "admin privileges", "sudo vulnerability", "elevation of privilege"
    ],
    "Memory Corruption": [
        "memory corruption", "buffer overflow", "stack overflow", "heap overflow", "out-of-bounds write", 
        "null pointer dereference", "memory leak", "use after free", "segmentation fault", "invalid memory access",
        "glibc buffer overflow", "assert() vulnerability" , "object corruption", "buffer overflow", "out-of-bounds memory access",
    "heap overflow", "stack overflow", "invalid memory access", "segmentation fault",
    "use after free", "memory leakage", "null pointer dereference"
    ],
    "Code Injection": [
        "code injection", "command injection", "remote code execution", "script injection", "programmatic injection"
    ],
    "Cross-Site Request Forgery (CSRF)": [
        "cross-site request forgery", "CSRF", "one-click attack", "session riding", "user action forgery",
        "csrf token bypass"
    ],
    "XML External Entity (XXE)": [
        "XXE", "external entity injection", "XML injection", "XML bomb", "XXE vulnerability"
    ],
    "Path Traversal": [
        "path traversal", "directory traversal", "file inclusion", "local file inclusion", "remote file inclusion",
        "LFI", "RFI", "directory traversal attack"
    ],
    "Insecure Direct Object References (IDOR)": [
        "insecure direct object reference", "IDOR", "object reference vulnerability", "unauthorized access", "object-level authorization"
    ],
    "Broken Authentication": [
        "broken authentication", "authentication bypass", "login bypass", "credential stuffing", "password guessing", "brute force attack"
    ],
    "Session Fixation": [
        "session fixation", "session hijacking", "session stealing", "session management issue"
    ],
    "Server Side Request Forgery (SSRF)": [
        "server side request forgery", "SSRF", "request forgery", "HTTP request smuggling", "server side attack"
    ],
    "Information Disclosure": [
        "information disclosure", "data leakage", "sensitive data exposure", "insecure data storage", "leaked credentials",
        "unauthorized data access", "MySQL unauthorized access" , "unauthorized read access", "information exposure",
    "sensitive data access", "data disclosure"
    ],
    "Cross-Site Script Inclusion (XSSI)": [
        "cross-site script inclusion", "XSSI", "script inclusion attack", "external script injection"
    ],
    "Clickjacking": [
        "clickjacking", "UI redress attack", "UI spoofing", "click hijacking", "transparent iframe", "framebusting bypass"
    ],
    "Buffer Overflow": [
        "buffer overflow", "stack smashing", "stack overflow", "heap overflow", "integer overflow", "out-of-bounds write", "buffer underflow"
    ],
    "LDAP Injection": [
        "LDAP injection", "LDAP query injection", "ldap command injection"
    ],
    "Command Injection": [
        "command injection", "shell injection", "remote command execution", "system command execution", "system injection"
    ],
    "Unsafe File Upload": [
        "unsafe file upload", "file upload vulnerability", "unrestricted file upload", "malicious file upload", "file upload bypass"
    ],
    "Insecure Deserialization": [
        "insecure deserialization", "object deserialization", "remote code execution via deserialization", "deserialization attack", "deserialization vulnerability"
    ],
    "Broken Access Control": [
        "broken access control", "unauthorized access", "access control vulnerability", "access rights management",
        "missing authorization", "incorrect access control configuration" ,  "unauthorized access", "unauthorized modification",
    "access privilege escalation", "privilege misuse"
    ],
    "Insufficient Logging & Monitoring": [
        "insufficient logging", "lack of logging", "monitoring failure", "log retention issue", "log management"
    ],
    "Insufficient Entropy": [
    "insufficient entropy", "predictable randomness", "weak randomness", "getrandom",
    "arc4random", "poor random generation"
    ],
    "Unrestricted Redirects and Forwards": [
        "unrestricted redirect", "open redirect", "unvalidated redirect", "forwarding vulnerability", "redirect vulnerability"
    ],
    "XML Bomb": [
        "XML bomb", "billion laughs", "XML DoS", "XML denial of service", "xml entity expansion"
    ],
    "Security Misconfiguration": [
        "security misconfiguration", "default credentials", "default configuration", "misconfigured security settings"
    ],
    "Insufficient Cryptography": [
        "insufficient cryptography", "weak encryption", "cryptography vulnerability", "cryptographic weakness", "unprotected data"
    ],
    "Unvalidated Input": [
        "unvalidated input", "input validation", "input sanitization", "data injection", "input injection", "unsafe input"
    ],
    "Weak Password Policy": [
        "weak password policy", "password complexity", "password strength", "password guessing", "password cracking"
    ],
    "Hardcoded Credentials": [
        "hardcoded credentials", "embedded passwords", "passwords in source code", "hardcoded secrets"
    ],
    "Denial of Service by Resource Exhaustion": [
        "resource exhaustion", "memory exhaustion", "CPU exhaustion", "resource leak", "excessive resource consumption"
    ],
    "Insecure Communication": [
        "insecure communication", "unencrypted traffic", "insecure protocol", "man-in-the-middle", "MITM attack"
    ],
    "Broken Cryptography": [
        "broken cryptography", "cryptographic vulnerability", "weak cipher", "cryptographic flaws", "flawed encryption algorithm"
    ],
    "Memory Management Vulnerability": [
    "buffer initialization", "zero out buffer", "buffer over-read",
    "improper buffer handling", "buffer underflow", "invalid buffer access"
    ],
    "Race Condition": [
        "race condition", "timing attack", "concurrent access vulnerability", "data race" , "timing attack", "deadlock", "concurrent process", "thread synchronization",
    "queue handling", "synchronization error", "resource contention", "lock contention"
    ],
    "Side-Channel Attack": [
        "side-channel attack", "timing attack", "cache attack", "power analysis", "differential power analysis"
    ],
    "Logic Flaw": [
        "logic flaw", "business logic vulnerability", "flawed business logic", "logic error" , "business logic vulnerability", "flawed logic", "incorrect handling",
    "logic error", "invalid operation", "mismanagement", "improper handling"
    ],
    "Open Port": [
        "open port", "unused open port", "exposed port", "unfiltered port", "service port"
    ],
    "Security Patch Missing": [
        "security patch missing", "unpatched vulnerability", "missing security update", "outdated software", "missing hotfix"
    ],
    "Weak Session Management": [
        "weak session management", "session fixation", "session hijacking", "session token management issue", "session timeout issue"
    ],
    "Host Header Injection": [
        "host header injection", "HTTP host header injection", "header injection attack"
    ],
    "Directory Traversal": [
        "directory traversal", "path traversal", "file inclusion attack", "local file inclusion", "remote file inclusion"
    ],
    "Open Redirect": [
        "open redirect", "unvalidated URL redirect", "arbitrary redirection", "URL manipulation"
    ],
    "Privilege Gaining": [
        "gain privilege", "elevated privilege attack", "privilege abuse", "unauthorized privilege escalation"
    ]
}
def google_search_cve(cve_code, sites):
    """
    Searches Google for a CVE on specific sites using strict `site:` filtering.

    Args:
        cve_code (str): The CVE code to search for.
        sites (list): List of sites to restrict the search to.

    Returns:
        dict: A dictionary where keys are site names and values are lists of search results.
    """
    base_url = "https://www.google.com/search"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
    }

    # Combine sites into a single query
    site_query = " OR ".join([f"site:{site}" for site in sites])
    query = f'"{cve_code}" ({site_query})'
    params = {"q": query, "hl": "en"}

    response = requests.get(base_url, params=params, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch results. Status code: {response.status_code}")
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    search_results = []

    for g in soup.find_all("div", class_="tF2Cxc"):
        title = g.find("h3").text if g.find("h3") else "No title"
        link = g.find("a")["href"] if g.find("a") else "No link"
        snippet = g.find("span", class_="aCOpRe").text if g.find("span", class_="aCOpRe") else "No snippet"
        search_results.append({
            "title": title,
            "link": link,
            "snippet": snippet
        })

    return search_results
def detect_vulnerability_type(description):
    """Detect the type of vulnerability based on its description."""
    for vuln_type, keywords in wordlist.items():
        for keyword in keywords:
            if re.search(rf"\b{keyword}\b", description, re.IGNORECASE):
                return vuln_type
    return "Not defined"

def format_date(date_str):
    try:
        # Supprimer les parties horaires si présentes et nettoyer les espaces inutiles
        date_str = date_str.split('T')[0].split(' ')[0].strip()
        # Gérer le format "December 19, 2024" et le convertir au format AAAA-MM-JJ
        return datetime.strptime(date_str, "%B %d, %Y").strftime("%Y-%m-%d")
    except ValueError:
        try:
            # Si déjà au format AAAA-MM-JJ, le retourner directement
            return datetime.strptime(date_str, "%Y-%m-%d").strftime("%Y-%m-%d")
        except ValueError:
            return date_str

def determine_max_cvss(severity_or_value):
    try:
        # Si c'est une valeur numérique, la retourner directement
        return float(severity_or_value)
    except ValueError:
        # Sinon, mapper les valeurs textuelles aux scores CVSS
        severity_mapping = {
            "Important": 8,
            "Moderate": 6,
            "Low": 2
        }
        return severity_mapping.get(severity_or_value, "N/A")

def clean_resume(resume):
    # Ignorer le mot "Description" au début d'un résumé
    return resume.lstrip("Description").strip()

# Fusionner et transformer les données
rows = []
SITES = ["bleepingcomputer.com", "thehackernews.com", "microsoft.com"]
# Traiter les données de cve_output
for entry in cve_output:
    result1 = google_search_cve(entry.get("title", ""), SITES)
    if result1:
        rows.append({
            "Code CVE": entry.get("title", ""),
            "Max CVSS": determine_max_cvss(entry.get("severity", "").split("\n")[0]),
            "Type Vulnerability": detect_vulnerability_type(entry.get("description", "")),
            "Date": format_date(entry.get("publish_date", "")),
            "Source": "Red Hat",  # Exemple de source par défaut
            "Lien": entry.get("link", ""),
            "Resume": clean_resume(entry.get("description", "")),
            "Lien Article": result1[0]['link'], # Ajouter "Lien Article"
        })
    else:
        rows.append({
            "Code CVE": entry.get("title", ""),
            "Max CVSS": determine_max_cvss(entry.get("severity", "").split("\n")[0]),
            "Type Vulnerability": detect_vulnerability_type(entry.get("description", "")),
            "Date": format_date(entry.get("publish_date", "")),
            "Source": "Red Hat",  # Exemple de source par défaut
            "Lien": entry.get("link", ""),
            "Resume": clean_resume(entry.get("description", "")),
            "Lien Article": "No link found",
        })

# Traiter les données de vulnerabilities
for entry in vulnerabilities:
    result2 = google_search_cve(entry.get("title", ""), SITES)
    if result2:
        rows.append({
            "Code CVE": entry.get("CVE", ""),
            "Max CVSS": determine_max_cvss(entry.get("severity", "")),
            "Type Vulnerability": detect_vulnerability_type(entry.get("detail_content", "")),
            "Date": format_date(entry.get("published_date", "")),
            "Source": "Rapid7",  # Exemple de source par défaut
            "Lien": entry.get("cve_url", ""),
            "Resume": clean_resume(entry.get("detail_content", "")),
            "Lien Article": result2[0]['link'],  # Ajouter "Lien Article"
        })
    else:
        rows.append({
            "Code CVE": entry.get("CVE", ""),
            "Max CVSS": determine_max_cvss(entry.get("severity", "")),
            "Type Vulnerability": detect_vulnerability_type(entry.get("detail_content", "")),
            "Date": format_date(entry.get("published_date", "")),
            "Source": "Rapid7",  # Exemple de source par défaut
            "Lien": entry.get("cve_url", ""),
            "Resume": clean_resume(entry.get("detail_content", "")),
            "Lien Article": "No link found",})

# Traiter les données de Results
for entry in results:
    result3 = google_search_cve(entry.get("Code CVE", ""), SITES)
    if result3:
        rows.append({
            "Code CVE": entry.get("Code CVE", ""),
            "Max CVSS": determine_max_cvss(entry.get("Max CVSS", entry.get("severity", ""))),
            "Type Vulnerability": entry.get("Vulnerability", detect_vulnerability_type(entry.get("Resume", ""))),
            "Date": format_date(entry.get("Date", "")),
            "Source": entry.get("Source", ""),
            "Lien": entry.get("Lien", ""),
            "Resume": clean_resume(entry.get("Resume", "")),
            "Lien Article": result3[0]['link'],  # Ajouter "Lien Article"
        })
    else:
        rows.append({
            "Code CVE": entry.get("Code CVE", ""),
            "Max CVSS": determine_max_cvss(entry.get("Max CVSS", entry.get("severity", ""))),
            "Type Vulnerability": entry.get("Vulnerability", detect_vulnerability_type(entry.get("Resume", ""))),
            "Date": format_date(entry.get("Date", "")),
            "Source": entry.get("Source", ""),
            "Lien": entry.get("Lien", ""),
            "Resume": clean_resume(entry.get("Resume", "")),
            "Lien Article": "No link found",
            "Resume de l'article": "No summary found"})

# Convertir les données au format JSON
output_file = 'CVE_Analysis.json'
with open(output_file, 'w') as json_file:
    json.dump(rows, json_file, indent=4)

print(f"Les données ont été sauvegardées dans le fichier : {output_file}")