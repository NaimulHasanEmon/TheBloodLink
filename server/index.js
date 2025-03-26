const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Import routes
const donorRoutes = require('./routes/donorRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@thebloodlink.usvja.mongodb.net/?retryWrites=true&w=majority&appName=TheBloodLink`;

// Validate environment variables
if (!process.env.DB_USER || !process.env.DB_PASS) {
    console.error("ERROR: MongoDB credentials not defined");
    process.exit(1);
}

// MongoDB Client
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();
        const db = client.db("bloodLink");
        
        // Store collections
        app.locals.collections = {
            donors: db.collection("donors"),
            searchStats: db.collection("searchStats")
        };

        // Register routes
        app.use('/donors', donorRoutes);
        app.use('/search', searchRoutes);
        
        // Search counter endpoints
        app.get('/search-count', async (req, res) => {
            try {
                // Get the count document from database (create if it doesn't exist)
                let countDoc = await app.locals.collections.searchStats.findOne({ type: 'searchCount' });
                
                if (!countDoc) {
                    // Initialize if it doesn't exist
                    await app.locals.collections.searchStats.insertOne({ type: 'searchCount', count: 0 });
                    return res.json({ count: 0 });
                }
                
                return res.json({ count: countDoc.count });
            } catch (error) {
                console.error('Error fetching search count:', error);
                res.status(500).json({ error: 'Failed to fetch search count' });
            }
        });
        
        app.post('/increment-search-count', async (req, res) => {
            try {
                // Increment the count using findOneAndUpdate
                const result = await app.locals.collections.searchStats.findOneAndUpdate(
                    { type: 'searchCount' },
                    { $inc: { count: 1 } },
                    { returnDocument: 'after', upsert: true }
                );
                
                // Return the updated count
                return res.json({ count: result.value ? result.value.count : 1 });
            } catch (error) {
                console.error('Error incrementing search count:', error);
                res.status(500).json({ error: 'Failed to increment search count' });
            }
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error; // Let the error propagate to be caught by run().catch
    }
}

// Start server
run()
    .then(() => {
        app.get("/", (req, res) => {
            res.send("The Blood Link Server is running");
        });

        app.listen(port, () => {
            console.log(`The Blood Link Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Failed to start server:", error);
        process.exit(1);
    });

// Graceful shutdown
process.on('SIGTERM', async () => {
    await client.close();
    process.exit(0);
});