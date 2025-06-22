import requests
from bs4 import BeautifulSoup
import os

# The website we want to scrape
BASE_URL = "https://support.grip.events"

# The name of the file where we'll save all the information
OUTPUT_FILE = "knowledge_base.txt"

def scrape_article(url):
    """
    This function takes a URL of an article, scrapes its title and content,
    and returns them as text.
    """
    try:
        # Some links in the page are full URLs, some are relative
        if not url.startswith('http'):
            url = BASE_URL + url

        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        soup = BeautifulSoup(response.content, 'lxml')

        # Find the article title
        title_element = soup.find('h1')
        title = title_element.get_text(strip=True) if title_element else "No Title"

        # Find the article content
        content_element = soup.find('div', class_='kb-article')
        content = content_element.get_text(strip=True) if content_element else "No Content"
        
        # We'll format it nicely
        return f"Title: {title}\n\nURL: {url}\n\nContent:\n{content}\n\n---\n\n"
    except requests.RequestException as e:
        print(f"Could not fetch article {url}: {e}")
        return None

def main():
    """
    This is the main function that runs our scraper.
    """
    # We'll clear the output file if it already exists to start fresh
    if os.path.exists(OUTPUT_FILE):
        os.remove(OUTPUT_FILE)
        
    print("Starting to scrape the Grip knowledge base...")

    # Let's find the category URLs from the main page
    category_links = []
    try:
        print(f"Finding categories on the main page: {BASE_URL}")
        response = requests.get(BASE_URL)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'lxml')
        
        category_elements = soup.find_all('a', class_='kb-index__category')
        for element in category_elements:
            href = element.get('href')
            if href:
                full_url = BASE_URL + href
                if full_url not in category_links:
                    category_links.append(full_url)
    except requests.RequestException as e:
        print(f"Could not fetch the main page {BASE_URL}: {e}")
        return

    if not category_links:
        print("Could not find any category links. Exiting.")
        return
        
    print(f"Found {len(category_links)} categories.")

    all_article_links = []
    # First, we get all the links to the individual articles from each category page
    for category_url in category_links:
        try:
            print(f"Finding articles in category: {category_url}")
            response = requests.get(category_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'lxml')
            
            # Find the main content area for the category
            content_area = soup.find('div', class_='kb-categories')
            if content_area:
                # Find all links within that area
                article_links = content_area.find_all('a', href=True)
                for link in article_links:
                    href = link.get('href')
                    if href and not href.startswith('#'): # ignore anchor links
                        if href not in all_article_links:
                            all_article_links.append(href)
            
        except requests.RequestException as e:
            print(f"Could not fetch category page {category_url}: {e}")

    print(f"\nFound a total of {len(all_article_links)} articles to scrape.\n")

    # Now, we scrape each article and save its content
    scraped_count = 0
    for link in all_article_links:
        print(f"Scraping: {link}")
        article_text = scrape_article(link)
        if article_text:
            scraped_count += 1
            with open(OUTPUT_FILE, 'a', encoding='utf-8') as f:
                f.write(article_text)
    
    print(f"\nScraping complete! Successfully scraped {scraped_count} articles.")
    print(f"All the information has been saved to '{OUTPUT_FILE}'.")


if __name__ == "__main__":
    main() 