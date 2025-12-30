import express from "express";
import connectDB from "./db.js";
import articleRoutes from "./routes/articles.js";
import scrapeArticles from "./scraper.js";

const app = express();
const PORT = 3000;

app.use(express.json()); 

app.use("/articles", articleRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        scrapeArticles(); 
    });
});
