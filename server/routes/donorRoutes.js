const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// This file organizes donor-related routes that were previously in index.js

// Get all donors
router.get('/', async (req, res) => {
  try {
    const donorsCollection = req.app.locals.collections.donors;
    const cursor = donorsCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching donors:", error);
    res.status(500).send({ error: "Failed to fetch donors" });
  }
});

// Get donor by UID - This route must be defined BEFORE the /:id route
router.get('/user/:uid', async(req, res) => {
  try {
    const uid = req.params.uid;
    
    if (!uid) {
      return res.status(400).send({ error: "User ID (uid) is required" });
    }
    
    console.log("Fetching donor for UID:", uid);
    const query = {uid: uid};
    const donorsCollection = req.app.locals.collections.donors;
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

// Get donor by ID
router.get('/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const donorsCollection = req.app.locals.collections.donors;
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

// Create a new donor
router.post('/', async(req, res) => {
  try {
    const donor = req.body;
    
    // Validate required fields
    if (!donor.uid) {
      return res.status(400).send({ error: "User ID (uid) is required" });
    }
    
    const donorsCollection = req.app.locals.collections.donors;
    
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
router.put('/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const options = { upsert: false }; // Changed to false to prevent accidental creation
    const updatedDonor = req.body;
    
    const donorsCollection = req.app.locals.collections.donors;
    
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

module.exports = router; 