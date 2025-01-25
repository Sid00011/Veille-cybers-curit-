from flask import Flask, jsonify
import schedule
import subprocess
import time
import threading

app = Flask(__name__)

def run_combined_and_analyse_sans_resume():
    # Exécute Combined.py
    combined_result = subprocess.run(['python', 'Combined.py'], capture_output=True, text=True)
    if combined_result.returncode == 0:
        print("Combined.py ran successfully")

        # Si Combined.py a réussi, exécute hh.py
        analyse_result = subprocess.run(['python', 'analyse_sans_resume.py'], capture_output=True, text=True)
        if analyse_result.returncode == 0:
            print("analyse_sans_resume.py ran successfully")
        else:
            print("analyse_sans_resume.py encountered an error")
    else:
        print("Combined.py encountered an error")


def schedule_scraper():
    schedule.every(0.1).minutes.do(run_combined_and_analyse_sans_resume)
    while True:
        schedule.run_pending()
        time.sleep(1)

@app.route('/')
def home():
    return jsonify({'message': 'Server is running'})

if __name__ == '__main__':
    scraping_thread = threading.Thread(target=schedule_scraper)
    scraping_thread.start()
    app.run(port=5000)
