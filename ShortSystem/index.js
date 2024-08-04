import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

// In-memory data store
let shorts = [];

let numOfShorts = 0;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


//Write your code here//

//CHALLENGE 1: GET All posts
app.get("/shorts", (req, res) => {
  res.json(shorts);
});

//CHALLENGE 2: GET a specific post by id
app.get("/shorts/:id", (req, res) =>{
  const getShort = shorts.find((short) => short.id === parseInt(req.params.id));
  if (!getShort){
    res.sendStatus(404).json({error: `Cannot find short`});
  }
  res.json(getShort);
})
//CHALLENGE 3: POST a new post
app.post("/shorts", (req, res) => {
    const dropExists = shorts.some(short => short.drop === req.body.drop);

    const newNumOfShorts = numOfShorts + 1;
    const short = {
        id: newNumOfShorts,
        size: req.body.size,
        rating: req.body.rating,
        brand: req.body.brand,
        type: req.body.type,
    };

    if (!dropExists) {
        short.drop = req.body.drop; // Only add drop if it doesn't already exist
    }

    numOfShorts = newNumOfShorts;
    shorts.push(short);

    res.status(201).json(shorts);
});

//CHALLENGE 4: PATCH a post when you just want to update one parameter
app.patch("/shorts/:id", (req, res) => {
  const currentShort = shorts.find((short) => short.id === parseInt(req.params.id));
  const newShort = {
    id: parseInt(req.params.id),
    drop: req.body.drop || currentShort.drop,
    size: req.body.size || currentShort.size,
    rating: req.body.rating || currentShort.rating,
    brand: req.body.brand || currentShort.brand,
    type: req.body.type || currentShort.type,
  };
  const searchIndex = shorts.findIndex((short) => short.id === parseInt(req.params.id));
  shorts[searchIndex] = newShort;
  res.json(newShort).status(201);
})

//CHALLENGE 5: DELETE a specific post by providing the post id.
app.delete("/shorts/:id", (req, res) => {
  const index = shorts.findIndex((short) => short.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({message: "Short not found"});
  }

  shorts.splice(index, 1);
  res.json({message: "Short Deleted"});
})

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
