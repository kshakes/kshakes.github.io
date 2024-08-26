import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;

const apiKey = "yourapikey";
const apiLink = "https://api.coingecko.com/api/v3/";

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set(bodyParser.urlencoded({extended: true}));

app.listen(port, (req, res) => {
    console.log(`Listening on localhost:${port}`);
    fetchData();
})

const config = {
    headers: {"x-cg-demo-api-key": apiKey},
}

let jsonData;

app.get("/", async (req, res) => {
    fetchData();
    res.render("index.ejs", {data: jsonData});
});

function fetchData(){ //Fetches old data saved in a json to prevent use of api tokens
    try{
        fs.readFile('response.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading the JSON: ', err);
                return;
            }
            try{
                jsonData = JSON.parse(data);
            } catch (err){
                console.error('Error parsing');
            }
        })    
    } catch (error){
        console.error(`Error message: ${error.message}`);
    }
}

