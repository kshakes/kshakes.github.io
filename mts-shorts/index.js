import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

let shorts = [{
    "Bham West":[],
    "Worcester":[],
    "Black Country":[],
    "Stafford":[],
    "Shrewsbury":[],
    "Bham Central":[],
    "Stoke South":[],
    "Reddich":[],
    "Bham North":[],
    "Burton":[],
    "Stoke North":[]
}];
let numOfShorts = 0;
let shortsResolved = 0;

fs.readFile("shorts.json", (error, data) => {
    if (error){
        console.error(error);
        throw error;
    } else{
        shorts = JSON.parse(data);
    }
    app.listen(port, (req, res) => {
        console.log(`Listening on localhost:${port}`);
    });
    
})

app.get("/", (req, res) => {
    res.render("index", {shorts, numOfShorts, shortsResolved});
    const data = JSON.stringify(shorts);
    fs.writeFileSync("shorts.json", data, (error) => {
        if (error){
            console.error(error);
            throw error;
        }
    })
    console.log(JSON.stringify(shorts));
})

app.get("/shorts/new", (req, res) => {
    res.render("new", {
        heading: "New Short",
        submit: "Post Short",
    });
});

app.post("/shorts", (req, res) => {
    const id = Date.now().toString();
    const short = {
        id: id,
        location: req.body.location,
        drop: req.body.drop,
        info: req.body.info,
        quantity: req.body.quantity,
    };
    if (short.location === "reset" || short.info === "reset" || short.quantity === "reset"){
        fs.readFile("resetShorts.json", (error, data) => {
            if (error){
                console.error(error);
                throw error;
            } else{
                shorts = JSON.parse(data);
            }
        })
    }else{
        shorts[0][req.body.drop].push(short);
        //console.log(shorts[0][req.body.drop]);
        numOfShorts++;
    }
    
    res.redirect("/");
});

app.get("/shorts/:id/edit", (req, res) => {
    const shortId = req.params.id;
    let foundShort = null;

    for (const location in shorts[0]) {
        if (shorts[0].hasOwnProperty(location)) {
            const locationShorts = shorts[0][location];
            foundShort = locationShorts.find(s => s.id === shortId);
            if (foundShort) {
                break;
            }
        }
    }

    if (foundShort) {
        res.render("edit", {
            short: foundShort,
            heading: "Edit Short",
            submit: "Edit Short",
        });
    } else {
        res.status(404).send("Short not found");
    }
});

app.post("/shorts/:id/update", (req, res) => {
    const {id} = req.params;
    const {drop, location, info, quantity} = req.body;

    let foundShort = null;
    let currentDrop = null;

    for (const location in shorts[0]) {
        if (shorts[0].hasOwnProperty(location)) {
            const locationShorts = shorts[0][location];
            foundShort = locationShorts.find(s => s.id === id);
            
            if (foundShort){
                currentDrop = location;
                break;
            } 
        }
    }
    if (foundShort) {
        shorts[0][currentDrop] = shorts[0][currentDrop].filter(s => s.id !== id);

        foundShort.drop = drop;
        foundShort.location = location;
        foundShort.info = info;
        foundShort.quantity = quantity;

        shorts[0][drop].push(foundShort);

        res.redirect("/");
    } else{
        res.status(404).send("Short not found");
    }  
})

app.post("/shorts/:id/delete", (req, res) => {
    const shortId = req.params.id;
    let foundShort = null;

    for (const location in shorts[0]) {
        if (shorts[0].hasOwnProperty(location)) {
            const locationShorts = shorts[0][location];
            const index = locationShorts.findIndex(s => s.id === shortId);

            if (index !== -1) {
                locationShorts.splice(index, 1);
                foundShort = true;
                break;
            }
        }
    }
    if (foundShort) {
        shortsResolved++;
        res.redirect("/");
    } else{
        res.status(404).send("Short not found");
    }
});