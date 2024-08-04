import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 4000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let shorts = [{}];

let numOfShorts = 0;

app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
});

app.get("/shorts", (req, res) => {
    res.json(shorts);
});

app.post("/shorts", (req, res) => {
    console.log("POST /shorts received data:", req.body); // Log the request body
    const newId = numOfShorts += 1;
    const short = {
        drop: req.body.drop,
        size: req.body.size,
        rating: req.body.rating,
        brand: req.body.brand,
        type: req.body.type,
        id: newId,
    };
    shorts.push(short);
    console.log("Updated shorts array:", shorts); // Log the updated shorts array
    res.status(201).json(shorts);
});

app.get("/shorts/:id/edit", (req, res) => {
    const currentShort = shorts.find(short => short.id === req.params.id);
    const newShort = {
        id: parseInt(req.params.id),
        drop: req.body.drop || currentShort.drop,
        size: req.body.size || currentShort.size,
        rating: req.body.rating || currentShort.rating,
        brand: req.body.brand || currentShort.brand,
        type: req.body.type || currentShort.type,
    };
    const searchIndex = shorts.findIndex(short => short.id === req.params.id);
    shorts[searchIndex] = newShort;
    res.status(200).json(newShort);
});

app.post("/shorts/:id/delete", (req, res) => {
    shorts = shorts.filter(short => short.id !== req.params.id);
    res.redirect("/");
});
