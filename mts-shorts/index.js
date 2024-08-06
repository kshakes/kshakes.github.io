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
    console.log(shorts);
    console.log(shorts[0][req.body.drop]);
    numOfShorts++;
    res.redirect("/");
});

app.get("/shorts/:id/edit", (req, res) => {
    const short = shorts.find(s => s.id === req.params.id);
    res.render("edit", {
        short,
        heading: "Edit Short",
        submit: "Edit Short",
    });
});

app.post("/shorts/:id/update", (req, res) => {
    //fix the ability to edit
    const { id } = req.params;
    const {drop, size, rating, brand, type, quantity} = req.body;
    const short = shorts.find(s => s.id === id);

    short.drop = drop;
    short.size = size;
    short.rating = rating;
    short.brand = brand;
    short.type = type;
    short.quantity = quantity;

    res.redirect("/");
})

app.post("/shorts/:id/delete", (req, res) => {
    //fix the ability to delete
    const short = shorts.find(s => s.id === req.params.id);
    console.log(short);

    shorts = shorts.filter(s => s.id !== req.params.id);

    shortsResolved++;
    res.redirect("/");
});