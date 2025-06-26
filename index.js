
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.djvkmk5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const plantsCollection = client.db('plantsDB').collection('plants');
    const usersCollection = client.db('plantsDB').collection('users'); // assuming users collection for plantsDB

    // Plants APIs
    app.get('/plants', async (req, res) => {
      const result = await plantsCollection.find().toArray();
      res.send(result);
    });

    app.get('/plants/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await plantsCollection.findOne(query);
      res.send(result);
    });

    app.post('/plants', async (req, res) => {
      const newPlant = req.body;
      console.log(newPlant);
      const result = await plantsCollection.insertOne(newPlant);
      res.send(result);
    });

app.put('/plants/:id',  async(req, res) =>{
  const id  = req.params.id;
  const filter = { _id: new ObjectId(id)}
  const options = {upsert: true};
  const updatedPlants = req.body;
  const updatedDoc = {
    $set:updatedPlants
  }

   const result = await plantsCollection.updateOne(filter, updatedDoc, options);

   res.send(result);
})


    app.delete('/plants/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await plantsCollection.deleteOne(query);
      res.send(result);
    });

   
    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.post('/users', async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

   
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Tree Plant Server Getting Ready.');
});

app.listen(port, () => {
  console.log(`Tree Plant Server running on port ${port}`);
});