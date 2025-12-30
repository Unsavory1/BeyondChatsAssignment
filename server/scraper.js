import axios from "axios";
import * as cheerio from "cheerio";
import Article from "./models/Article.js";

const scrapeArticles = async () => {
    const url = "https://beyondchats.com/blogs/";
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Find the last page number
        const lastPageLink = $(".pagination .page-item:last-child .page-link").attr("href");
        const lastPageNumber = lastPageLink ? parseInt(lastPageLink.split("page=")[1]) : 1;

        const lastPageUrl = `${url}?page=${lastPageNumber}`;
        const lastPageResponse = await axios.get(lastPageUrl);
        const $$ = cheerio.load(lastPageResponse.data);

        const articles = [];
        $$(".card").each((i, element) => {
            if (i < 5) { // Get the 5 oldest articles
                const title = $$(element).find(".card-title a").text().trim();
                const articleUrl = $$(element).find(".card-title a").attr("href");
                const date = $$(element).find(".card-text.text-muted").text().trim();

                if (title && articleUrl && date) {
                    articles.push({ title, url: articleUrl, date });
                }
            }
        });

        for (const articleData of articles) {
            try {
                await Article.findOneAndUpdate(
                    { url: articleData.url },
                    articleData,
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
                console.log(`Article "${articleData.title}" saved/updated.`);
            } catch (error) {
                if (error.code === 11000) {
                    console.log(`Duplicate article skipped: "${articleData.title}"`);
                } else {
                    console.error(`Error saving article "${articleData.title}":`, error);
                }
            }
        }
        console.log("Scraping complete.");
    } catch (error) {
        console.error("Error during scraping:", error);
    }
};

export default scrapeArticles;
