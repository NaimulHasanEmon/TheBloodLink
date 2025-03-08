const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI from environment variables
const uri = process.env.MONGODB_URI || `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.apvf8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const donorsCollection = client.db("bloodLink").collection("donors");

    // Get all donors
    app.get("/donors", async (req, res) => {
      const cursor = donorsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get donor by ID
    app.get('/donors/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await donorsCollection.findOne(query)
        res.send(result);
    });

    // Get donor by UID
    app.get('/donors/user/:uid', async(req, res) => {
        const uid = req.params.uid;
        const query = {uid: uid}
        const result = await donorsCollection.findOne(query)
        res.send(result);
    });

    // Create a new donor
    app.post('/donors', async(req, res) => {
        const donor = req.body;
        const result = await donorsCollection.insertOne(donor);
        res.send(result);
    });

    // Update donor
    app.put('/donors/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = { upsert: true };
        const updatedDonor = req.body;
        const donor = {
            $set: {
                name: updatedDonor.name,
                email: updatedDonor.email,
                bloodGroup: updatedDonor.bloodGroup,
                phone: updatedDonor.phone,
                address: updatedDonor.address,
                division: updatedDonor.division,
                district: updatedDonor.district,
                upazila: updatedDonor.upazila,
                lastDonationDate: updatedDonor.lastDonationDate,
                photoURL: updatedDonor.photoURL,
                updatedAt: new Date()
            }
        }
        const result = await donorsCollection.updateOne(filter, donor, options);
        res.send(result);
    });

    // Search donors
    app.get('/search', async (req, res) => {
        const { division, district, upazila, bloodGroup } = req.query;
        
        const query = {};
        
        if (bloodGroup) query.bloodGroup = bloodGroup;
        if (division) query.division = division;
        if (district) query.district = district;
        if (upazila) query.upazila = upazila;
        
        const donors = await donorsCollection.find(query).toArray();
        res.send(donors);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("The Blood Link Server is running");
});

app.listen(port, () => {
  console.log(`The Blood Link Server is running on port ${port}`);
}); 