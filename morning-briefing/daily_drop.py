
import datetime
import requests
import json
import os
from bs4 import BeautifulSoup

# IMPORTANT: Replace this with your actual Discord Webhook URL
DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1487877217823232000/fk8uD2rgiKOHgKIIe-hdqRxWblu_O4s6s39QKZAX1fxK60ZwV7Nhb446L9pjUNirQyiO"

def fetch_philadelphia_weather():
    \"\"\"Fetches current weather for Philadelphia from Open-Meteo.\"\"\"
    url = "https://api.open-meteo.com/v1/forecast?latitude=39.9526&longitude=-75.1652&current_weather=true&temperature_unit=fahrenheit&timezone=America%2FNew_York"
    try:
        response = requests.get(url)
        response.raise_for_status() # Raise an exception for HTTP errors
        data = response.json()
        current = data.get("current_weather", {})
        temperature = current.get("temperature")
        weather_code = current.get("weathercode")

        # Map Open-Meteo weather codes to descriptions
        weather_descriptions = {
            0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
            45: "Fog", 48: "Depositing rime fog", 51: "Drizzle: Light", 53: "Drizzle: Moderate", 55: "Drizzle: Dense intensity",
            56: "Freezing Drizzle: Light", 57: "Freezing Drizzle: Dense intensity", 61: "Rain: Slight", 63: "Rain: Moderate", 65: "Rain: Heavy intensity",
            66: "Freezing Rain: Light", 67: "Freezing Rain: Heavy intensity", 71: "Snow fall: Slight", 73: "Snow fall: Moderate", 75: "Snow fall: Heavy intensity",
            77: "Snow grains", 80: "Rain showers: Slight", 81: "Rain showers: Moderate", 82: "Rain showers: Violent",
            85: "Snow showers: Slight", 86: "Snow showers: Heavy", 95: "Thunderstorm: Slight or moderate",
            96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
        }
        description = weather_descriptions.get(weather_code, "Unknown weather")

        if temperature is not None:
            return f"Philadelphia: {temperature}°F, {description}"
        return "Could not fetch Philadelphia weather."
    except requests.exceptions.RequestException as e:
        return f"Error fetching weather: {e}"

def scrape_internships():
    \"\"\"Scrapes Data Science/AI internships from the SimplifyJobs GitHub README.\"\"\"
    url = "https://github.com/SimplifyJobs/Summer2026-Internships/blob/dev/README.md"
    internship_data = []
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # GitHub renders README.md as HTML, so we need to parse the HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the div that contains the rendered markdown content
        # This might need adjustment if GitHub's page structure changes
        content_div = soup.find('div', class_='markdown-body')

        if content_div:
            # We are looking for tables, which will be rendered as <table> tags
            tables = content_div.find_all('table')
            
            # Assuming the internships are in the first table or a specific table
            if tables:
                # Find the table headers to identify columns
                headers = [th.get_text(strip=True) for th in tables[0].find_all('th')]
                
                job_title_index = -1
                company_index = -1
                link_index = -1

                try:
                    job_title_index = headers.index("Job Title")
                    company_index = headers.index("Company")
                    link_index = headers.index("Link")
                except ValueError:
                    return "Could not find 'Job Title', 'Company', or 'Link' headers in the internship table."


                # Iterate through table rows
                for row in tables[0].find_all('tr')[1:]: # Skip header row
                    cols = row.find_all('td')
                    if len(cols) > max(job_title_index, company_index, link_index):
                        job_title = cols[job_title_index].get_text(strip=True)
                        company = cols[company_index].get_text(strip=True)
                        link_tag = cols[link_index].find('a')
                        link = link_tag['href'] if link_tag else 'N/A'
                        
                        # Filter for Data Science or AI roles
                        if any(keyword in job_title.lower() for keyword in ["data science", "ai", "artificial intelligence", "machine learning"]):
                            internship_data.append({
                                "title": job_title,
                                "company": company,
                                "link": link
                            })
                            if len(internship_data) >= 5: # Limit to 5 roles
                                break
            else:
                return "No tables found in the internship listing."
        else:
            return "Could not find markdown content div on the page."

    except requests.exceptions.RequestException as e:
        return f"Error fetching internship data: {e}"
    except Exception as e:
        return f"Error parsing internship data: {e}"

    if internship_data:
        discord_message = ["### Top 5 Data Science/AI Internships:"]
        for job in internship_data:
            discord_message.append(f"• **{job['title']}** at {job['company']}: <{job['link']}>")
        return "\\n".join(discord_message)
    else:
        return "No Data Science/AI internships found."


def fetch_hacker_news_ai_stories():
    \"\"\"Fetches top 3 AI-related stories from Hacker News.\"\"\"
    ai_stories = []
    try:
        # Get top story IDs
        top_stories_url = "https://hacker-news.firebaseio.com/v0/topstories.json"
        top_story_ids = requests.get(top_stories_url).json()

        # Fetch details for a few top stories and filter for 'AI'
        story_count = 0
        for story_id in top_story_ids[:50]: # Check up to 50 top stories
            if story_count >= 3:
                break
            item_url = f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json"
            story_details = requests.get(item_url).json()

            if story_details and "title" in story_details and "url" in story_details:
                title = story_details["title"]
                url = story_details["url"]
                if "AI" in title.upper() or "ARTIFICIAL INTELLIGENCE" in title.upper():
                    ai_stories.append(f"• [{title}]({url})")
                    story_count += 1
        
        if ai_stories:
            return "### Top 3 AI Stories from Hacker News:\\n" + "\\n".join(ai_stories)
        return "### Top 3 AI Stories from Hacker News:\\nNo AI stories found in the top 50."
    except requests.exceptions.RequestException as e:
        return f"Error fetching Hacker News stories: {e}"

def generate_daily_summary():
    \"\"\"Generates the full daily summary.\"\"\"
    summary_parts = []
    summary_parts.append(f"# Daily Drop - {datetime.date.today().strftime('%A, %B %d, %Y')}")
    summary_parts.append("") # Spacer

    # Weather
    weather = fetch_philadelphia_weather()
    summary_parts.append("## Current Weather:")
    summary_parts.append(f"• {weather}")
    summary_parts.append("")

    # Internships
    internships = scrape_internships()
    summary_parts.append(internships)
    summary_parts.append("")

    # Hacker News
    hn_stories = fetch_hacker_news_ai_stories()
    summary_parts.append(hn_stories)

    return "\\n".join(summary_parts)

def post_to_discord(content):\
    \"\"\"Posts the summary to Discord using a webhook.\"\"\"\
    if DISCORD_WEBHOOK_URL == \"YOUR_DISCORD_WEBHOOK_URL_HERE\":\
        print(\"Error: Discord Webhook URL is not configured. Please update the script.\")\
        return\

    headers = {\"Content-Type\": \"application/json\"}\
    payload = {\"content\": content}\
    \
    try:\
        response = requests.post(DISCORD_WEBHOOK_URL, data=json.dumps(payload), headers=headers)\
        response.raise_for_status()\
        print(\"Daily briefing successfully posted to Discord.\")\
    except requests.exceptions.RequestException as e:\
        print(f\"Error posting to Discord: {e}\")\

if __name__ == "__main__":
    summary = generate_daily_summary()
    print(summary) # Also print to console for debugging
    post_to_discord(summary)

# Instructions for Windows Task Scheduler:
# 1. Open Task Scheduler: Search for "Task Scheduler" in the Windows search bar.
# 2. Create Basic Task: In the right-hand panel, click "Create Basic Task...".
# 3. Name and Description: Give your task a name (e.g., "Daily Morning Briefing") and an optional description. Click "Next".
# 4. Trigger: Select "Daily". Click "Next".
# 5. Daily Trigger: Set the desired time (e.g., 08:00:00 AM) and start date. Ensure "Recur every 1 days" is set. Click "Next".
# 6. Action: Select "Start a program". Click "Next".
# 7. Start a Program:
#    - Program/script: Enter the path to your Python executable, e.g., "C:\\Python39\\python.exe" (adjust to your Python installation path).
#    - Add arguments (optional): Enter the path to your script, e.g., "C:\\Users\\Test1\\.openclaw\\workspace\\morning-briefing\\daily_drop.py"
#    - Start in (optional): Enter the directory where your script is located, e.g., "C:\\Users\\Test1\\.openclaw\\workspace\\morning-briefing"
# 8. Finish: Review your settings and click "Finish".
#
# IMPORTANT:
# - Ensure you have Python and the 'requests' and 'beautifulsoup4' libraries installed (pip install requests beautifulsoup4).
# - Replace "YOUR_DISCORD_WEBHOOK_URL_HERE" with your actual Discord webhook URL.
# - Ensure your computer is awake or set to wake up at the scheduled time for the task to run.
