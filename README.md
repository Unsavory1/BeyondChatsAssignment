# I know its wrong to upload .env files but its a just a google search api key and i cant be bothered to write a .gitignore its easy but i just cant be bothered btw
# BeyondChats Assignment - Blog Scraper & API

A Node.js application that scrapes blog articles from BeyondChats and provides a REST API to manage them. The application automatically fetches the 5 oldest articles from the blog, stores them in MongoDB, and exposes CRUD endpoints for article management.

## Features

- **Web Scraping**: Automatically scrapes articles from [beyondchats.com/blogs/](https://beyondchats.com/blogs/)
- **Article Storage**: Saves articles to MongoDB with automatic duplicate detection
- **REST API**: Full CRUD operations for managing articles
- **Pagination Support**: Handles paginated blog content
- **Auto-scraping on Startup**: Scrapes articles when the server starts

## Tech Stack

- **Runtime**: Node.js with ES Modules
- **Web Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Web Scraping**: Axios + Cheerio
- **Port**: 3000

## Dependencies

```json
{
  "axios": "^1.13.2",        // HTTP requests
  "cheerio": "^1.1.0",       // HTML parsing
  "mongoose": "^8.20.4"      // MongoDB ODM
}
```

## Project Structure

```
server/
├── index.js           # Application entry point
├── server.js          # Express server configuration
├── db.js              # MongoDB connection
├── scraper.js         # Web scraping logic
├── models/
│   └── Article.js     # Article schema definition
└── routes/
    └── articles.js    # API route handlers
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Ensure MongoDB is running on `mongodb://127.0.0.1:27017/beyondchats`

3. Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000` and automatically scrape articles on startup.

## API Endpoints

### GET /articles
Retrieves all articles, sorted by scraping date (newest first)

**Response:**
```json
[
  {
    "_id": "...",
    "title": "Article Title",
    "url": "https://...",
    "date": "Published date",
    "scrapedAt": "2025-12-30T..."
  }
]
```

### GET /articles/:id
Retrieves a single article by ID

**Response:** Single article object or 404 if not found

### POST /articles
Creates a new article

**Request Body:**
```json
{
  "title": "Article Title",
  "url": "https://...",
  "date": "Published date"
}
```

**Response:** Created article object with status 201

**Error:** Returns 409 if article URL already exists (duplicate)

### PUT /articles/:id
Updates an article by ID

**Request Body:** Any fields to update

**Response:** Updated article object or 404 if not found

### DELETE /articles/:id
Deletes an article by ID

**Response:** Deleted article object or 404 if not found

## Data Model

### Article Schema

```javascript
{
  title: String,                              // Article title
  url: { type: String, unique: true },        // Article URL (unique constraint)
  date: String,                               // Publication date
  scrapedAt: { type: Date, default: Date.now } // Scraping timestamp
}
```

## How It Works

1. **Server Startup** (index.js)
   - Connects to MongoDB
   - Starts Express server on port 3000
   - Triggers article scraping

2. **Web Scraping** (scraper.js)
   - Fetches the BeyondChats blogs main page
   - Finds the last page number
   - Navigates to the last page
   - Extracts the 5 oldest articles (title, URL, date)
   - Saves/updates articles in MongoDB using `findOneAndUpdate` with `upsert`

3. **API Handling** (routes/articles.js)
   - Serves CRUD endpoints for article management
   - Handles duplicate article detection
   - Returns proper HTTP status codes

## Configuration

- **MongoDB URI**: `mongodb://127.0.0.1:27017/beyondchats`
- **Server Port**: `3000`
- **Articles to Scrape**: 5 (oldest articles from the last page)

To change these settings, edit the corresponding values in:
- `db.js` (MongoDB URI)
- `server.js` (Port)
- `scraper.js` (Number of articles, URL)

## Notes

- Articles are identified by their unique URL
- Duplicate articles are automatically skipped during scraping
- The scraping runs automatically when the server starts
- Timestamps (`scrapedAt`) track when articles were added to the database

## License

ISC
