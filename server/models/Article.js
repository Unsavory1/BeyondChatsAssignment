//schema definition for Article model
import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
    title: String,
    url: { type: String, unique: true },
    date: String,
    scrapedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Article", ArticleSchema);
