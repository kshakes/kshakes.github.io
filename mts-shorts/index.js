import express from "express";
import bodyParser from "body-parser";
const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

let shorts = [];
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
    const dropExists = shorts.some(short => short.drop === req.body.drop);

    const id = Date.now().toString();
    const short = {
        id: id,
        size: req.body.size,
        rating: req.body.rating,
        brand: req.body.brand,
        type: req.body.type,
        quantity: req.body.quantity,
    };

    if (!dropExists){
        short.drop = req.body.drop;
    }

    shorts.push(short);
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
    const { id } = req.params;
    const {drop, size, rating, brand, type, quantity} = req.body;
    const short = shorts.find(s => s.id === id);

    const oldDrop = short.drop;

    short.drop = drop;
    short.size = size;
    short.rating = rating;
    short.brand = brand;
    short.type = type;
    short.quantity = quantity;

    if (oldDrop !== drop){
        const dropExists = shorts.some(s => s.drop === drop && s.id !== id);
        if (dropExists) {
            delete short.drop;
        }
    }
    const oldDropExists = shorts.some(s => s.drop === oldDrop);
    if (!oldDropExists) {
        shorts = shorts.map(s => {
            if (s.drop === oldDrop) {
                delete s.drop;
            }
            return s;
        });
    }
    res.redirect("/");
})

app.post("/shorts/:id/delete", (req, res) => {
    const short = shorts.find(s => s.id === req.params.id);
    console.log(short);
    const oldDrop = short.drop;

    shorts = shorts.filter(s => s.id !== req.params.id);

    const oldDropExists = shorts.some(s => s.drop === oldDrop);
    if (!oldDropExists) {
        shorts = shorts.map(s => {
            if (s.drop === oldDrop) {
                delete s.drop;
            }
            return s;
        });
    }
    shortsResolved++;
    res.redirect("/");
});