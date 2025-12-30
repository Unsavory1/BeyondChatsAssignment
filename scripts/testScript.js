// testFetch.js
import fetchArticlesFromAPI from "./fetchArticlesFromAPI.js";

(async () => {
    const articles = await fetchArticlesFromAPI();
    console.log(articles);
})();
