const express = require('express');
const router = express.Router();

// Blood group compatibility chart
const bloodCompatibility = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-']
};

// Search donors
router.get('/', async (req, res) => {
  try {
    const { bloodGroup, division, district, upazila } = req.query;
    
    console.log('Search query parameters:', { bloodGroup, division, district, upazila });
    
    // Build the query object based on provided parameters
    const query = {};
    
    // If bloodGroup is specified, include compatible blood groups
    if (bloodGroup) {
      const compatibleGroups = bloodCompatibility[bloodGroup] || [bloodGroup];
      query.bloodGroup = { $in: compatibleGroups };
    }
    
    if (division) query.division = division;
    if (district) query.district = district;
    if (upazila) query.upazila = upazila;
    
    console.log('MongoDB query:', query);
    
    const donorsCollection = req.app.locals.collections.donors;
    
    // Find donors matching the criteria
    const cursor = donorsCollection.find(query);
    const donors = await cursor.toArray();
    
    // Add a field to indicate if it's an exact match
    const donorsWithMatchType = donors.map(donor => ({
      ...donor,
      isExactMatch: donor.bloodGroup === bloodGroup
    }));
    
    console.log(`Found ${donors.length} donors matching criteria`);
    
    // Return the donors array
    res.json(donorsWithMatchType);
  } catch (error) {
    console.error('Error searching for donors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 