import "dotenv/config"; 
const api_key=process.env.serp_api_key;

async function googleSearch(query){
    console.log("searching for, ",query); 
   // console.log("Loaded API key:", process.env.SERP_API_KEY);
    const url=`https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&num=3&api_key=${api_key}`;
    const response=await fetch(url); 
    const data=await response.json();  
    const results=data.organic_results;
    const filteredResults=results.filter(item=>item.link);
    const links=filteredResults.map(item=>item.link);
    const top_links=links.slice(0,2); 
   // console.log("Top links: ",top_links);  
    return top_links; 
}
export default googleSearch;  
//googleSearch("Beyond Chats blog");