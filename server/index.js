import * as cheerio from "cheerio";
import Article from "./models/Article.js";
import connectDB from "../db.js";

async function fetchLastPosts() {
    const BASE = "https://beyondchats.com/blogs";

    const res1 = await fetch(BASE);
    const text1 = await res1.text();
    const $1 = cheerio.load(text1);

    const pages = [];
    $1(".page-numbers").each((_, el) => {
        const t = $1(el).text().trim();
        if (!isNaN(t)) pages.push(Number(t));
    });

    let page = pages.length ? Math.max(...pages) : 1;
    const oldest = [];

    while (page >= 1 && oldest.length < 5) {
        const url = page === 1 ? `${BASE}/` : `${BASE}/page/${page}/`;
        const res = await fetch(url);
        const html = await res.text();
        const $ = cheerio.load(html);

        const posts = [];

        $(".entry-card").each((_, el) => {
            posts.push({
                title: $(el).find("h2 a").text().trim(),
                url: $(el).find("h2 a").attr("href"),
                date: $(el).find(".meta-date").text().trim()
            });
        });

        for (let i = posts.length - 1; i >= 0 && oldest.length < 5; i--) {
            oldest.push(posts[i]);
        }

        page--;
    }

    return oldest;
}

async function saveArticles(articles) {
    for (const article of articles) {
        try {
            await Article.create(article);
        } catch (err) {
            if (err.code !== 11000) {
                console.error("Insert failed:", err);
            }
        }
    }
}

async function main() {
    await connectDB();
    const oldestPosts = await fetchLastPosts();
    await saveArticles(oldestPosts);
    console.log("Articles saved");
}

main().catch(console.error);
