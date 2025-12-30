import * as cheerio from "cheerio"; 

async function scrapeArticles(url){
     const res=await fetch(url);
     const data=await res.text(); 
     const $=cheerio.load(data);

     let content=""; 
     if($("article").length){
        content=$("article").text(); 
     } else if($("main").length){ 
        content=$("main").text(); 
     } else{
        content=$("p").text();
     }
     console.log(content.slice(0,500));
    // return content; 
    }
    export default scrapeArticles;
    scrapeArticles("https://www.independent.co.uk/arts-entertainment/tv/features/stranger-things-netflix-final-episode-secret-b2891574.html");
    