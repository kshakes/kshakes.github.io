import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

const apiKey = "yourCoinGeckoAPIKey";
const apiLink = "https://api.coingecko.com/api/v3/coins/markets";

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

const config = {
    headers: {"x-cg-demo-api-key": apiKey},
    "Cache-Control": "no-cache",
    accept: 'application/json'
}

app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
});

app.get("/", async (req, res) => {
    try{
        const response = await axios.get(apiLink + '?vs_currency=gbp&order=market_cap_desc&per_page=10&price_change_percentage=24h%2C7d%2C30d', config);
        const jsonData = response.data;
        res.render("index.ejs", {data: jsonData});

    } catch (error){
        console.error(`Error message: ${error.message}`);

        res.render("index.ejs", {data: []});
    }
    
});

