require('dotenv').config({path: '../../server.env'});
const mongoose = require('mongoose');
const {Restaurant} = require('../models');

// Location coordinates for each area (longitude, latitude)
const areaCoordinates = {
  Mayfair: [-0.147, 51.5095],
  Soho: [-0.134, 51.5135],
  'Covent Garden': [-0.1225, 51.5117],
  Piccadilly: [-0.137, 51.509],
  'Liverpool Street': [-0.0823, 51.5178],
  Westminster: [-0.1276, 51.4995],
  Knightsbridge: [-0.16, 51.499],
  Chelsea: [-0.168, 51.4875],
  Marylebone: [-0.154, 51.5195],
  'Tower Bridge': [-0.0754, 51.5055],
};

// Helper to get location with slight randomization
const getLocation = areaName => {
  const coords = areaCoordinates[areaName] || [-0.1278, 51.5074];
  // Add slight randomization (about 200m radius)
  const randomOffset = () => (Math.random() - 0.5) * 0.004;
  return {
    type: 'Point',
    coordinates: [coords[0] + randomOffset(), coords[1] + randomOffset()],
    address: `${Math.floor(Math.random() * 200) + 1} ${areaName} Street`,
    city: 'London',
    country: 'United Kingdom',
  };
};

const addLocationData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const restaurants = await Restaurant.find({});
    console.log(`Found ${restaurants.length} restaurants`);

    for (const restaurant of restaurants) {
      if (!restaurant.location || !restaurant.location.coordinates) {
        restaurant.location = getLocation(restaurant.areaName);
        await restaurant.save();
        console.log(`✓ Updated location for: ${restaurant.name}`);
      }
    }

    console.log('\n✅ All restaurants updated with location data!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addLocationData();
