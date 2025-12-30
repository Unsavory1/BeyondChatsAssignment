//crud implementation for articles
import express from "express";
import Article from "../models/Article.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const article = await Article.create(req.body);
        res.status(201).json(article);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Duplicate article" });
        }
        res.status(500).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    const articles = await Article.find().sort({ scrapedAt: -1 });
    res.json(articles);
});

router.get("/:id", async (req, res) => {
    const article = await Article.findById(req.params.id);
    if (!article) {
        return res.status(404).json({ message: "Not found" });
    }
    res.json(article);
});

router.put("/:id", async (req, res) => {
    const article = await Article.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!article) {
        return res.status(404).json({ message: "Not found" });
    }

    res.json(article);
});

router.delete("/:id", async (req, res) => {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
        return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Article deleted" });
});

export default router;
