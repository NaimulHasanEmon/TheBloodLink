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
const uri = process.env.MONGODB_URI;

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
    // Connect the client to the server
    await client.connect();

    // Get reference to the database and collections
    const db = client.db("bloodLink");
    const donorsCollection = db.collection("donors");

    // Get all donors
    app.get("/donors", async (req, res) => {
      try {
        const cursor = donorsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching donors:", error);
        res.status(500).send({ error: "Failed to fetch donors" });
      }
    });

    // Get donor by ID
    app.get('/donors/:id', async(req, res) => {
      try {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await donorsCollection.findOne(query);
        
        if (!result) {
          return res.status(404).send({ error: "Donor not found" });
        }
        
        res.send(result);
      } catch (error) {
        console.error("Error fetching donor by ID:", error);
        res.status(500).send({ error: "Failed to fetch donor" });
      }
    });

    // Get donor by UID
    app.get('/donors/user/:uid', async(req, res) => {
      try {
        const uid = req.params.uid;
        
        if (!uid) {
          return res.status(400).send({ error: "User ID (uid) is required" });
        }
        
        console.log("Fetching donor for UID:", uid);
        const query = {uid: uid};
        const result = await donorsCollection.findOne(query);
        
        if (!result) {
          console.log("No donor found for UID:", uid);
          return res.status(404).send({ error: "Donor not found" });
        }
        
        console.log("Donor found:", result._id);
        res.send(result);
      } catch (error) {
        console.error("Error fetching donor by UID:", error);
        res.status(500).send({ error: "Failed to fetch donor", details: error.message });
      }
    });

    // Create a new donor
    app.post('/donors', async(req, res) => {
      try {
        const donor = req.body;
        
        // Validate required fields
        if (!donor.uid) {
          return res.status(400).send({ error: "User ID (uid) is required" });
        }
        
        // Check if donor with this uid already exists
        const existingDonor = await donorsCollection.findOne({ uid: donor.uid });
        if (existingDonor) {
          return res.status(409).send({ 
            error: "Donor with this user ID already exists",
            donorId: existingDonor._id 
          });
        }
        
        // Ensure minimum required fields
        if (!donor.name) {
          donor.name = "Anonymous User";
        }
        
        // Add timestamps
        donor.createdAt = donor.createdAt || new Date();
        donor.updatedAt = new Date();
        
        const result = await donorsCollection.insertOne(donor);
        console.log("Donor created:", result);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error creating donor:", error);
        res.status(500).send({ error: "Failed to create donor", details: error.message });
      }
    });

    // Update donor
    app.put('/donors/:id', async(req, res) => {
      try {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = { upsert: false }; // Changed to false to prevent accidental creation
        const updatedDonor = req.body;
        
        // Validate donor exists
        const existingDonor = await donorsCollection.findOne(filter);
        if (!existingDonor) {
          return res.status(404).send({ error: "Donor not found" });
        }
        
        const donor = {
          $set: {
            name: updatedDonor.name || existingDonor.name,
            email: updatedDonor.email || existingDonor.email,
            bloodGroup: updatedDonor.bloodGroup || existingDonor.bloodGroup,
            phone: updatedDonor.phone || existingDonor.phone,
            address: updatedDonor.address || existingDonor.address,
            division: updatedDonor.division || existingDonor.division,
            district: updatedDonor.district || existingDonor.district,
            upazila: updatedDonor.upazila || existingDonor.upazila,
            lastDonationDate: updatedDonor.lastDonationDate || existingDonor.lastDonationDate,
            photoURL: updatedDonor.photoURL || existingDonor.photoURL,
            updatedAt: new Date()
          }
        };
        
        const result = await donorsCollection.updateOne(filter, donor, options);
        console.log("Donor updated:", result);
        res.send(result);
      } catch (error) {
        console.error("Error updating donor:", error);
        res.status(500).send({ error: "Failed to update donor", details: error.message });
      }
    });

    // Search donors
    app.get('/search', async (req, res) => {
      try {
        const { bloodGroup, division, district, upazila } = req.query;
        
        console.log('Search query parameters:', { bloodGroup, division, district, upazila });
        
        // Build the query object based on provided parameters
        const query = {};
        
        if (bloodGroup) query.bloodGroup = bloodGroup;
        if (division) query.division = division;
        if (district) query.district = district;
        if (upazila) query.upazila = upazila;
        
        console.log('MongoDB query:', query);
        
        // Get reference to the database and collections
        const db = client.db("bloodLink");
        const donorsCollection = db.collection("donors");
        
        // Find donors matching the criteria
        const cursor = donorsCollection.find(query);
        const donors = await cursor.toArray();
        
        console.log(`Found ${donors.length} donors matching criteria`);
        
        // Return the donors array
        res.json(donors);
      } catch (error) {
        console.error('Error searching for donors:', error);
        res.status(500).json({ message: 'Server error' });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Keep the server running even if MongoDB connection fails
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("The Blood Link Server is running");
});

app.listen(port, () => {
  console.log(`The Blood Link Server is running on port ${port}`);
}); 