import express from "express";
import bodyParser from "body-parser";
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

app.listen(port, (req, res) => {
    console.log(`Listening on localhost:${port}`);
});

app.get("/", (req, res) => {
    res.render("index", {shorts, numOfShorts, shortsResolved});
    console.log("Total Number of Shorts -> " + numOfShorts);
    console.log(shorts);
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
        drop: req.body.drop,
        size: req.body.size,
        rating: req.body.rating,
        brand: req.body.brand,
        type: req.body.type,
        quantity: req.body.quantity,
    };
    shorts[0][req.body.drop].push(short);
    console.log(shorts[0][req.body.drop]);
    numOfShorts++;
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
    const {drop, size, rating, brand, type, quantity} = req.body;

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
        foundShort.size = size;
        foundShort.rating = rating;
        foundShort.brand = brand;
        foundShort.type = type;
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