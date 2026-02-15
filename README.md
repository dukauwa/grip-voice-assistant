# Grip Voice Assistant

Grip Voice Assistant is a custom AI-powered voice assistant for Grip.events, designed to answer questions about the company and its event platform using real knowledge scraped from the official [Grip Support Knowledge Base](https://support.grip.events/). It leverages [Vapi.ai](https://vapi.ai/) for voice interaction and can be tested locally via a modern web UI.

---

## Features

- **Company Knowledge Base Integration:** Answers questions using up-to-date content scraped from the Grip.events support site.
- **Vapi.ai Voice Assistant:** Uses Vapi.ai for natural, conversational voice interaction.
- **Custom Web UI:** Includes a modern, animated orb interface for listening/speaking states, allowing you to test the assistant outside the Vapi dashboard.
- **Easy Setup:** Simple Python scripts and web assets for local development and testing.

---

## How It Works

1. **Scraping the Knowledge Base:**
   - A Python script (`scraper.py`) uses `requests` and `BeautifulSoup` to crawl and extract all articles from the Grip.events support site.
   - The script saves article titles, URLs, and content into `knowledge_base.txt` for use as the assistant's knowledge base.

2. **Uploading to Vapi.ai:**
   - The contents of `knowledge_base.txt` can be uploaded to Vapi.ai as the assistant's knowledge base, enabling it to answer company-specific questions.

3. **Web Integration:**
   - The web UI (see `src/`) provides a visually engaging interface for interacting with the assistant.
   - Uses the Vapi.ai web SDK (imported via CDN) to connect to your assistant using your public API key and assistant ID.

4. **Security:**
   - **Never share your private API key.** Only use your public API key in frontend code.
   - The assistant will not function if the API key is missing or incorrect.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "Grip voice assistant"
```

### 2. Set Up Python Environment (for Scraper)

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Scrape the Knowledge Base

```bash
python scraper.py
```
- This will create/update `knowledge_base.txt` with the latest articles from https://support.grip.events/.

### 4. Upload Knowledge Base to Vapi.ai

- Log in to your [Vapi.ai](https://vapi.ai/) dashboard.
- Create a new assistant (or use an existing one).
- Upload the contents of `knowledge_base.txt` as the assistant's knowledge base.

### 5. Set Up the Web UI

- Go to the `src/` directory.
- Open `index.html` in your browser, or serve it locally:

```bash
# From the project root
yarn global add serve  # or use python -m http.server
serve src
# or
python3 -m http.server --directory src 8000
```

- Edit `script.js` to add your Vapi public API key and assistant ID.

### 6. Test the Assistant

- Open the local web page in your browser.
- Interact with the animated orb to speak to your assistant.
- The assistant will answer using knowledge from the uploaded knowledge base.

---

## Security Best Practices

- **Never expose your Vapi private API key.** Only use the public key in frontend code.
- If you encounter issues, check the browser console for errors and ensure your server is running.
- If you see `OSError: [Errno 48] Address already in use`, stop any previous server processes before starting a new one.

---

## Project Structure

- `scraper.py` — Python script to scrape the knowledge base
- `knowledge_base.txt` — Output file with all scraped articles
- `src/` — Web UI (HTML, CSS, JS)
- `public/assets/` — UI assets (animations, images)
- `requirements.txt` — Python dependencies for the scraper

---

## Credits

- Built by the product/design team at Grip.events
- Uses [Vapi.ai](https://vapi.ai/) for voice assistant technology
- Knowledge base content © Grip.events

---

## License

MIT (or specify your license here)
