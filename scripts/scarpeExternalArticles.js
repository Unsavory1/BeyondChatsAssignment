import * as cheerio from "cheerio";

async function scrapeArticleContent(url) {
    const res = await fetch(url);

    if (!res.ok) {
        console.log("Failed to fetch article:", url);
        return "";
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const article = $("article");

    if (!article.length) {
        console.log("No article tag found:", url);
        return "";
    }

    const paragraphs = article
        .find("p")
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 50);

    return paragraphs.join("\n\n");
}

const content = await scrapeArticleContent(
  "https://beyondchats.com/blogs/choosing-the-right-ai-chatbot-a-guide/"
);

console.log(content);

