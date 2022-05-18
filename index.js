const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const app = express();

// middle ware
app.use(cors());
app.use(express.json());

// connect with mongoDB

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wzbz9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    await client.connect();
    const todoCollection = client.db("shopping_todo").collection("toto_lists");

    // get data from database
    app.get("/todolists", async (req, res) => {
      const result = await todoCollection.find().toArray();
      res.send(result);
    });
    
  } finally {
    // client.close()
  }
};
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Todo app server is running");
});

app.listen(port, () => {
  console.dir(`Server is runnign on ${port}`);
});
