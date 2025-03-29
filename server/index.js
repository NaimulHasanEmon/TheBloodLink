const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Import routes - only keeping search routes
const searchRoutes = require('./routes/searchRoutes');

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Explicitly allow DELETE
  credentials: true,
  optionsSuccessStatus: 204, // Some legacy browsers (IE11) choke on 204
  preflightContinue: false // Handle OPTIONS requests correctly
}));
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
        // Add this right after app.use(express.json());
        app.use((req, res, next) => {
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
            next();
        });

        // Mount search routes
        app.use('/search', searchRoutes);
        
        // Admin middleware to check if user is an admin
        const isAdmin = async (req, res, next) => {
          try {
            const email = req.query.email;
            console.log("Admin check for email:", email);
            
            if (!email) {
              console.log("No email provided in request");
              return res.status(401).send({ error: "Unauthorized access" });
            }

            // Check if the email is one of the admin emails
            const adminEmails = ['mustakimemon1272000@gmail.com', 'thebloodlink01@gmail.com'];
            console.log("Admin emails configured:", adminEmails);
            console.log("Is admin?", adminEmails.includes(email));
            
            if (adminEmails.includes(email)) {
              next();
            } else {
              console.log("Access denied for:", email);
              return res.status(403).send({ error: "Forbidden access" });
            }
          } catch (error) {
            console.error("Error in admin verification:", error);
            res.status(500).send({ error: "Internal server error" });
          }
        };

        // DONOR ROUTES - Moved from donorRoutes.js to index.js

        // Get all donors
        app.get('/donors', async (req, res) => {
          try {
            const donorsCollection = app.locals.collections.donors;
            const cursor = donorsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
          } catch (error) {
            console.error("Error fetching donors:", error);
            res.status(500).send({ error: "Failed to fetch donors" });
          }
        });

        // Route for the client to check if a user is admin
        app.get('/donors/is-admin', async (req, res) => {
          try {
            const email = req.query.email;
            if (!email) {
              return res.status(400).send({ error: "Email parameter is required" });
            }
            
            // Check if email is in admin list
            const adminEmails = ['mustakimemon1272000@gmail.com', 'thebloodlink01@gmail.com'];
            const isAdmin = adminEmails.includes(email);
            
            res.send({ isAdmin });
          } catch (error) {
            console.error("Error checking admin status:", error);
            res.status(500).send({ error: "Failed to check admin status" });
          }
        });

        // Route to check if admin exists in database (for debugging)
        app.get('/donors/check-admin', async (req, res) => {
          try {
            const email = req.query.email;
            if (!email) {
              return res.status(400).send({ error: "Email parameter is required" });
            }
            
            console.log("Checking if admin exists in DB:", email);
            const donorsCollection = app.locals.collections.donors;
            
            // Check if user exists
            const user = await donorsCollection.findOne({ email });
            console.log("User found:", user ? "Yes" : "No");
            
            // Check if email is in admin list
            const adminEmails = ['mustakimemon1272000@gmail.com', 'thebloodlink01@gmail.com'];
            const isAdminEmail = adminEmails.includes(email);
            console.log("Is admin email:", isAdminEmail);
            
            res.send({
              userExists: !!user,
              userData: user ? {
                email: user.email,
                name: user.name,
                role: user.role || 'user',
                uid: user.uid
              } : null,
              isAdminEmail
            });
          } catch (error) {
            console.error("Error checking admin:", error);
            res.status(500).send({ error: "Failed to check admin status" });
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
            const donorsCollection = app.locals.collections.donors;
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

        // Route to create admin users if they don't exist (for debugging/setup)
        app.post('/donors/create-admin', async (req, res) => {
          try {
            const donorsCollection = app.locals.collections.donors;
            const adminEmails = ['mustakimemon1272000@gmail.com', 'thebloodlink01@gmail.com'];
            
            const results = [];
            
            for (const email of adminEmails) {
              // Check if admin already exists
              const existingAdmin = await donorsCollection.findOne({ email });
              
              if (existingAdmin) {
                console.log(`Admin ${email} already exists`);
                results.push({ email, status: 'already exists', id: existingAdmin._id });
              } else {
                // Create the admin user
                const newAdmin = {
                  name: email.split('@')[0],
                  email: email,
                  role: 'admin',
                  createdAt: new Date(),
                  updatedAt: new Date()
                };
                
                const result = await donorsCollection.insertOne(newAdmin);
                console.log(`Admin ${email} created with ID ${result.insertedId}`);
                results.push({ email, status: 'created', id: result.insertedId });
              }
            }
            
            res.status(200).send({ results });
          } catch (error) {
            console.error("Error creating admin users:", error);
            res.status(500).send({ error: "Failed to create admin users" });
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
            
            const donorsCollection = app.locals.collections.donors;
            
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

        // Get donor by ID - Make sure this is placed after other specific /donors/... routes
        app.get('/donors/:id', async(req, res) => {
          try {
            const id = req.params.id;
            console.log('GET REQUEST FOR ID:', id);
            const query = {_id: new ObjectId(id)};
            const donorsCollection = app.locals.collections.donors;
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

        // Update donor
        app.put('/donors/:id', async(req, res) => {
          try {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const options = { upsert: false }; // Changed to false to prevent accidental creation
            const updatedDonor = req.body;
            
            const donorsCollection = app.locals.collections.donors;
            
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