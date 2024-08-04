import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to render the main page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/shorts`);
    console.log(response);
    res.render("index.ejs", { shorts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching shorts" });
  }
});

// Route to render the edit page
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Short", submit: "Create Short" });
});

app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/shorts/${req.params.id}`);
    console.log(response.data);
    res.render("modify.ejs", {
      heading: "Edit Short",
      submit: "Update Short",
      short: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching short" });
  }
});

// Create a new post
app.post("/api/shorts", async (req, res) => {
  try {
    // console.log("Received Data: ", req.body);
    const response = await axios.post(`${API_URL}/shorts`, req.body);
    // console.log("Response Data: ", response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error creating short" });
  }
});

// Partially update a post
app.post("/api/shorts/:id", async (req, res) => {
  try {
    const response = await axios.patch(
      `${API_URL}/shorts/${req.params.id}`,
      req.body
    );
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating short" });
  }
});

// Delete a post
app.get("/api/shorts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/shorts/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting short" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
