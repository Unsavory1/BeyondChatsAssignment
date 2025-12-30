const api_url="http://localhost:3000/articles"; 
async function fetchArticles() {
    const response=await fetch(api_url); 
    if(!response.ok){
        throw new Error(`request failed, status: ${response.status}`);  
       // console.log(response.status);
    }
    const articles=await response.json(); 
    return articles;
}
export default fetchArticles; 