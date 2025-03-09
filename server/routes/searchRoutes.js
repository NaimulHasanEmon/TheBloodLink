const express = require('express');
const router = express.Router();

// Search donors
router.get('/', async (req, res) => {
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
    
    const donorsCollection = req.app.locals.collections.donors;
    
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

module.exports = router; 