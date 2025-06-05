from bs4 import BeautifulSoup
import pandas as pd
from backend.pgvector.embedding import create_embedding
def parse_tender_table(html):
    soup = BeautifulSoup(html, 'html.parser')
    rows = soup.find_all('tr')
    
    data = []
    for row in rows:
        cells = row.find_all('td')
        if len(cells) < 5:
            continue  # Skip malformed rows

        # Title and link
        title_cell = cells[0].find('a')
        title = title_cell.get_text(strip=True) if title_cell else ''
        link = title_cell['href'] if title_cell else ''

        # Category
        category = cells[1].get_text(strip=True)

        # Published date & amended detection
        published_cell = cells[2]
        amended = published_cell.find('div', class_='amended-icon') is not None
        published = published_cell.get_text(strip=True).replace('Amended', '').strip()

        # Closing date
        closing_date = cells[3].get_text(strip=True)

        # Organization
        organization = cells[4].get_text(strip=True)

        #embedding
        embedding = create_embedding(title)

        data.append({
            'title': title,
            'link': link,
            'category': category,
            'published': published,
            'amended': amended,
            'closing_date': closing_date,
            'organization': organization,
            'embedding':embedding
        })

    return pd.DataFrame(data)
