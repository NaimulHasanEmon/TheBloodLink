const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
// Load environment variables before using them
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Import routes
const donorRoutes = require('./routes/donorRoutes');
const searchRoutes = require('./routes/searchRoutes');

// middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI from environment variables
// Manually construct the URI using individual environment variables
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const uri = `mongodb+srv://${dbUser}:${dbPass}@thebloodlink.usvja.mongodb.net/?retryWrites=true&w=majority&appName=TheBloodLink`;

// Validate that required environment variables are set
if (!dbUser || !dbPass) {
  console.error("ERROR: MongoDB credentials (DB_USER or DB_PASS) are not defined in environment variables");
  process.exit(1); // Exit with error
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_jwt_secret_key_here') {
  console.warn("WARNING: JWT_SECRET is not properly configured. This is a security risk in production.");
}

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
    
    // Store collections in app.locals for access in route handlers
    app.locals.collections = {
      donors: donorsCollection
    };

    // Register routes
    app.use('/donors', donorRoutes);
    app.use('/search', searchRoutes);

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