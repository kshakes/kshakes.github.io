import express from "express";
import bodyParser from "body-parser";
const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

let things = [];

app.listen(port, (req, res) => {
    console.log(`Listening on localhost:${port}`);
});

app.get("/", (req, res) => {
    res.render("index", {things});
})

app.get("/posts/new", (req, res) => {
    res.render("new");
});

app.post("/posts", (req, res) => {
    const { title, content } = req.body;
    const id = Date.now().toString();
    things.push({id, title, content});
    res.redirect("/");
});

app.get("/posts/:id/edit", (req, res) => {
    const post = things.find(p => p.id === req.params.id);
    res.render("edit", {post});
});

app.post("/posts/:id/update", (req, res) => {
    const { id } = req.params;
    const {title, content} = req.body;
    const post = things.find(p => p.id === id);
    post.title = title;
    post.content = content;
    res.redirect("/");
})

app.post("/posts/:id/delete", (req, res) => {
    things = things.filter(p => p.id !== req.params.id);
    res.redirect("/");
});