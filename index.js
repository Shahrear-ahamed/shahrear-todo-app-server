const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const app = express();

// middle ware
app.use(cors());
app.use(express.json());

// connect with mongoDB

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    app.get("/todolists/:email", async (req, res) => {
      const email = req.params.email;
      const result = await todoCollection.find({ email }).toArray();
      res.send(result);
    });
    app.post("/todolists", async (req, res) => {
      const todo = req.body;
      console.log(todo);
      const result = await todoCollection.insertOne(todo);
      res.send(result);
    });
    // update data from client to database
    app.put("/todolists/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: body,
      };
      const result = await todoCollection.updateOne(query, updateDoc, options);
      console.log(result);
      res.send(result);
    });
    app.delete("/todolists/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await todoCollection.deleteOne(filter);
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
