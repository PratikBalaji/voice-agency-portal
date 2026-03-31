
import requests
from bs4 import BeautifulSoup
import re
import json

# IMPORTANT: Replace this with your actual Discord Webhook URL
DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1488007747524890736/b8sGaMj16f472xc324y4_RkPnbHdMuUPtA-36_GY_cmkFq7k9f8d7k-rR1KT5HJi2IvU"

def scrape_hacker_news_jobs_for_discord():
    url = "https://news.ycombinator.com/jobs"
    job_postings = []
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        for row in soup.find_all('tr', class_='athing'):
            title_link = row.find('span', class_='titleline')
            if title_link:
                link_tag = title_link.find('a')
                if link_tag and link_tag.get('href'):
                    job_link = link_tag['href']
                    job_text = link_tag.get_text(strip=True)

                    company = "N/A"
                    role = job_text
                    
                    match = re.search(r'^(.*?)\s+\((.*?)\)$', job_text)
                    if match:
                        role = match.group(1).strip()
                        company = match.group(2).strip()
                    else:
                        next_sibling = title_link.find_next_sibling('span', class_='by')
                        if next_sibling:
                            company = next_sibling.get_text(strip=True)
                            role = job_text
                        else:
                            parts = job_text.split(' at ')
                            if len(parts) > 1:
                                role = parts[0].strip()
                                company = parts[-1].strip()
                    
                    if any(keyword in job_text.lower() for keyword in ['data', 'ai', 'machine learning']):
                        job_postings.append({
                            "company": company,
                            "role": role,
                            "link": job_link
                        })
        
        if job_postings:
            discord_message_lines = ["## Latest AI/Data Job Postings from Hacker News:", ""]
            for job in job_postings:
                discord_message_lines.append(f"**Company:** {job['company']}\n**Role:** {job['role']}\n**Link:** <{job['link']}>\n")
            
            return "\n".join(discord_message_lines)
        else:
            return "No 'Data', 'AI', or 'Machine Learning' job postings found on Hacker News."

    except requests.exceptions.RequestException as e:
        return f"Error fetching Hacker News jobs: {e}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

def post_to_discord(content):
    headers = {"Content-Type": "application/json"}
    payload = {"content": content}
    
    try:
        response = requests.post(DISCORD_WEBHOOK_URL, data=json.dumps(payload), headers=headers)
        response.raise_for_status()
        print("Job postings successfully posted to Discord.")
    except requests.exceptions.RequestException as e:
        print(f"Error posting to Discord: {e}")

if __name__ == "__main__":
    job_summary = scrape_hacker_news_jobs_for_discord()
    print(job_summary) # Print to console for debugging
    post_to_discord(job_summary)
