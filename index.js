require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//==>Middleware<==//
// app.use(cors());
// app.use(express.json());

//<------------------------------------>//
//<===============MongoDB==============>//
//<------------------------------------>//
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.3pjth5o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const coffeeCollection = client.db("coffeDb").collection("coffee");
    const usersCollection = client.db("coffeDb").collection("users");

    //===>Post User Information<===//
    app.post("/user", async (req, res) => {
      const userInfo = req.body;
      // console.log(userInfo);
      const result = await usersCollection.insertOne(userInfo);
      res.send(result);
    });

    //===>Get Users Information<===//
    app.get("/users", async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.send(users);
    });

    //===>Post Coffee<===//
    app.post("/coffee", async (req, res) => {
      const coffee = req.body;
      // console.log(coffee);
      const result = await coffeeCollection.insertOne(coffee);
      res.send(result);
    });

    //==>Get coffee<==//
    app.get("/coffee", async (req, res) => {
      const coffee = await coffeeCollection.find().toArray();
      res.send(coffee);
    });

    //===>Get Specific Coffee<===//
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      // console.log(id);
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    //==>Update a coffee information<==//
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const updatedInfo = req.body;
      // console.log(id, updatedInfo);

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: updatedInfo,
      };

      const result = await coffeeCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //===>Delete Specific One<===//
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      // console.log(id);
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Userver is connected!");
});
//==>Listen To the Port<===//
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
