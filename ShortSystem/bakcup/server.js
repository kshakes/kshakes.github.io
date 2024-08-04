import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log(`Backend server running on localhost:${port}`);
});

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}/shorts`);
        res.render("index.ejs", { shorts: response.data });
    } catch (error) {
        res.status(500).json({ message: "Error fetching shorts" });
    }
});

app.get("/new", (req, res) => {
    res.render("new.ejs", { heading: "New Short", submit: "Create Post" });
});

app.get("/shorts/:id/edit", async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}/shorts/${req.params.id}`);
        res.render("new.ejs", {
            heading: "Edit Short",
            submit: "Update Short",
            short: response.data,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching post" });
    }
});

app.post("/api/shorts", async (req, res) => {
    try {
        console.log("Received data:", req.body); // Log the request body
        const response = await axios.post(`${API_URL}/shorts`, req.body);
        console.log("API response data:", response.data); // Log the response data
        console.log(response.data);
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: "Error creating post" });
        console.log(error);
    }
});
