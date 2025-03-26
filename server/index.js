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
                console.log('Fetching search count from database...');
                // Get the count document from database (create if it doesn't exist)
                let countDoc = await app.locals.collections.searchStats.findOne({ type: 'searchCount' });
                
                if (!countDoc) {
                    console.log('No search count found, initializing to 0');
                    // Initialize if it doesn't exist
                    const result = await app.locals.collections.searchStats.insertOne({ type: 'searchCount', count: 0 });
                    console.log('Created search count document:', result.acknowledged);
                    return res.json({ count: 0 });
                }
                
                console.log('Current search count:', countDoc.count);
                return res.json({ count: countDoc.count });
            } catch (error) {
                console.error('Error fetching search count:', error);
                res.status(500).json({ error: 'Failed to fetch search count', details: error.message });
            }
        });
        
        app.post('/increment-search-count', async (req, res) => {
            try {
                console.log('Incrementing search count...');
                // Explicitly create the document if it doesn't exist
                const existingDoc = await app.locals.collections.searchStats.findOne({ type: 'searchCount' });
                
                if (!existingDoc) {
                    console.log('No search count found, creating new document with count 1');
                    const insertResult = await app.locals.collections.searchStats.insertOne({ type: 'searchCount', count: 1 });
                    console.log('Created search count document:', insertResult.acknowledged);
                    return res.json({ count: 1 });
                }
                
                // Increment the existing count
                const result = await app.locals.collections.searchStats.findOneAndUpdate(
                    { type: 'searchCount' },
                    { $inc: { count: 1 } },
                    { returnDocument: 'after' }
                );
                
                const newCount = result.value ? result.value.count : 1;
                console.log('Search count incremented to:', newCount);
                
                // Return the updated count
                return res.json({ count: newCount });
            } catch (error) {
                console.error('Error incrementing search count:', error);
                res.status(500).json({ error: 'Failed to increment search count', details: error.message });
            }
        });
        
        // Test endpoint to initialize search counter
        app.get('/init-search-counter', async (req, res) => {
            try {
                console.log('Initializing search counter...');
                const existingDoc = await app.locals.collections.searchStats.findOne({ type: 'searchCount' });
                
                if (existingDoc) {
                    console.log('Search counter already exists with count:', existingDoc.count);
                    return res.json({ message: 'Search counter already exists', count: existingDoc.count });
                }
                
                // Create the search stats collection and document
                const result = await app.locals.collections.searchStats.insertOne({ 
                    type: 'searchCount', 
                    count: 0,
                    createdAt: new Date()
                });
                
                console.log('Search counter initialized:', result.acknowledged);
                return res.json({ 
                    message: 'Search counter initialized successfully', 
                    acknowledged: result.acknowledged, 
                    count: 0
                });
            } catch (error) {
                console.error('Error initializing search counter:', error);
                res.status(500).json({ error: 'Failed to initialize search counter', details: error.message });
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