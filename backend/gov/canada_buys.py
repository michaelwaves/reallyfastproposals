import requests
import time
import json
from parse_html import parse_tender_table
import pandas as pd
from db import engine
BASE_URL = "https://canadabuys.canada.ca/en/views/ajax"

HEADERS = {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "x-requested-with": "XMLHttpRequest",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "referer": "https://canadabuys.canada.ca/en/tender-opportunities",
}

PARAMS_TEMPLATE = {
    "search_filter": "",
    "status[87]": 87,
    "record_per_page": 200,
    "items_per_page": 200,
    "current_tab": "t",
    "words": "",
    "order": "dummy_notice_title",
    "sort": "desc",
    "_wrapper_format": "drupal_ajax",
    "_drupal_ajax": 1,
    "view_name": "search_opportunities",
    "view_display_id": "block_1",
    "view_args": "",
    "view_path": "/node/10653",
    "view_base_path": "",
    "pager_element": 1,
}

def fetch_page(page):
    params = PARAMS_TEMPLATE.copy()
    params["page"] = f",{page}"
    print(f"Fetching page {page}...")

    response = requests.get(BASE_URL, headers=HEADERS, params=params)
    if response.status_code != 200:
        print(f"Failed to fetch page {page}: {response.status_code}")
        return None

    try:
        data = response.json()
        with open("./response.json","w") as f:
            json.dump(data, f)
        return response.json()
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        return None

def extract_html(response_json):
    items = []
    
    if isinstance(response_json, dict):
        items = response_json.values()
    elif isinstance(response_json, list):
        items = response_json
    else:
        return None  # Unexpected format

    for item in items:
        if isinstance(item, dict) and item.get("command") == "insert" and "data" in item:
            return item["data"]
    
    return None
def main():
    page = 0
    dfs = []

    while True:
        data = fetch_page(page)
        if not data:
            break
        html = extract_html(data)

        df = parse_tender_table(html)
        
        if not html or df.shape[0]==0:
            print("No more results. Stopping.")
            break

        dfs.append(df)

        page += 1
        time.sleep(1)  # Avoid hammering the server

    master_df = pd.concat(dfs)
    master_df.to_json("outputs.json",orient="records")
    master_df.to_sql("rfps", engine)

    print(f"✅ Done! Saved {master_df.shape[0]} records to outputs.json")

if __name__ == "__main__":
    main()
