require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

// Get MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function testConnection() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB server");

    // List all databases
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));

    // Check if bloodLink database exists
    const bloodLinkExists = databasesList.databases.some(db => db.name === "bloodLink");
    if (!bloodLinkExists) {
      console.log("Creating bloodLink database and donors collection...");
      await client.db("bloodLink").collection("donors").insertOne({ test: true });
      console.log("Database and collection created successfully");
    }

    // List collections in bloodLink database
    const collections = await client.db("bloodLink").listCollections().toArray();
    console.log("Collections in bloodLink database:");
    collections.forEach(collection => console.log(` - ${collection.name}`));

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("MongoDB connection closed");
  }
}

testConnection().catch(console.dir); 