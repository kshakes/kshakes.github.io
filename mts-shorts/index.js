import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "yourdatabase",
    password: "yourpassword",
    port: 5432,
});

db.connect();

let shortsData;
let numOfShorts = 0;
let shortsResolved = 0;

app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
});

app.get("/", async (req, res) => {
    try {
        const shorts = await db.query("SELECT * FROM shorts");
        shortsData = shorts.rows;

        const groupedShorts = shortsData.reduce((acc, short) => {
            if (!acc[short.drop]) {
                acc[short.drop] = [];
            }
            acc[short.drop].push(short);
            return acc;
        }, {});

        res.render("index", { groupedShorts, numOfShorts, shortsResolved });
    } catch (err) {
        console.error("Couldnt create front page: " + err);
    }
});

app.get("/shorts/new", (req, res) => {
    res.render("new", {
        heading: "New Short",
        submit: "Post Short",
    });
});

app.post("/shorts", async (req, res) => {
    const id = Date.now().toString();
    const short = {
        id: id,
        location: req.body.location,
        drop: req.body.drop,
        info: req.body.info,
        quantity: req.body.quantity,
    };
    if (short.location === "reset" || short.info === "reset" || short.quantity === "reset"){
        try{
            await db.query("DELETE FROM shorts");
            } catch (err) {
                console.log(err);
                return res.status(500).send("Database error -> Cant delete shorts");
            }
    }else{
        try{
            await db.query(
                "INSERT INTO shorts (id, location, drop, info, quantity) VALUES ($1, $2, $3, $4, $5)", [id, short.location, short.drop, short.info, short.quantity]);
            } catch (err) {
                console.log(err);
                return res.status(500).send("Database error -> Cannot write short");
            }
        numOfShorts++;
    }
    
    res.redirect("/");
});

app.get("/shorts/:id/edit", async (req, res) => {
    const shortId = req.params.id;
    let foundShort = null;

    try{
        const result = await db.query("SELECT * FROM shorts WHERE id = $1", [shortId]);
        foundShort = result.rows[0];
        } catch (err) {
            console.log(err);
            return res.status(500).send("Database error -> Cannot find short");
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

app.post("/shorts/:id/update", async (req, res) => {
    const id = req.params.id;
    const {drop, location, info, quantity} = req.body;

    console.log(id, drop, location, info, quantity);

    let foundShort = null;

    try{
        const result = await db.query("SELECT * FROM shorts WHERE id = $1", [id]);
        foundShort = result.rows[0];
        } catch (err) {
            console.log(err);
            return res.status(500).send("Database error -> Cannot find short");
        }

    if (foundShort) {
        await db.query("UPDATE shorts SET drop = $1, location = $2, info = $3, quantity = $4 WHERE id = $5", [drop, location, info, quantity, id]);
        res.redirect("/");
    } else{
        res.status(404).send("Short not found");
    }  
})

app.post("/shorts/:id/delete", async (req, res) => {
    const shortId = req.params.id;

    try{
        await db.query("DELETE FROM shorts WHERE id = $1", [shortId]);
    } catch (err){
        console.error("Cannot delete short: " + err);
    }
    shortsResolved++;
    res.redirect("/");
});