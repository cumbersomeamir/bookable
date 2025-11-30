require('dotenv').config({path: '../../server.env'});
const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const Area = require('../models/Area');
const Experience = require('../models/Experience');
const Promotion = require('../models/Promotion');

// MONGODB_URI must be set in server.env - no fallback to avoid leaking credentials
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not set in server.env');
  console.error('Please create server.env with your MongoDB connection string');
  process.exit(1);
}

// High-quality restaurant images from Unsplash
const restaurantImages = {
  benares: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  hakkasan: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
  engawa: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800&q=80',
  ivy: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
  balthazar: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  cecconis: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80',
  losMochis: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
  hawksmoor: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
  quaglinos: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80',
  robata: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80',
  purezza: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
  harrys: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&q=80',
  crustingPipe: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80',
  davysWine: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
  bocconcino: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80',
  experience: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=80',
};

// Cuisine category images
const cuisineImages = {
  italian: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&q=80',
  british: 'https://images.unsplash.com/photo-1577906096429-f73b2c6fd6e8?w=400&q=80',
  mediterranean: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
  french: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
  japanese: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80',
  chinese: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80',
  indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80',
  steakhouse: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
  vegan: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
  pacificRim: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
};

// Promotion images
const promotionImages = {
  cobraBeer: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
  noReservation: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
};

// Helper to generate slug
const generateSlug = name =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const seedAreas = async () => {
  const areas = [
    {name: 'Soho', displayOrder: 1, location: {coordinates: [-0.1337, 51.5136]}},
    {name: 'Covent Garden', displayOrder: 2, location: {coordinates: [-0.1225, 51.5117]}},
    {name: 'Mayfair', displayOrder: 3, location: {coordinates: [-0.1478, 51.5094]}},
    {name: 'Leicester Square', displayOrder: 4, location: {coordinates: [-0.1281, 51.5103]}},
    {name: 'Piccadilly', displayOrder: 5, location: {coordinates: [-0.134, 51.5074]}},
    {name: 'Fitzrovia', displayOrder: 6, location: {coordinates: [-0.1387, 51.5194]}},
    {name: 'Charing Cross', displayOrder: 7, location: {coordinates: [-0.1246, 51.5074]}},
    {name: 'Oxford Circus', displayOrder: 8, location: {coordinates: [-0.141, 51.5152]}},
    {name: 'Liverpool Street', displayOrder: 9, location: {coordinates: [-0.0823, 51.5178]}},
    {name: 'Camden', displayOrder: 10, location: {coordinates: [-0.1426, 51.539]}},
  ].map(a => ({...a, slug: generateSlug(a.name)}));

  await Area.deleteMany({});
  return await Area.insertMany(areas);
};

const seedCategories = async () => {
  const categories = [
    {name: 'Italian', image: {url: cuisineImages.italian, alt: 'Italian cuisine'}, displayOrder: 1},
    {name: 'British', image: {url: cuisineImages.british, alt: 'British cuisine'}, displayOrder: 2},
    {
      name: 'Mediterranean',
      image: {url: cuisineImages.mediterranean, alt: 'Mediterranean cuisine'},
      displayOrder: 3,
    },
    {name: 'French', image: {url: cuisineImages.french, alt: 'French cuisine'}, displayOrder: 4},
    {
      name: 'Japanese',
      image: {url: cuisineImages.japanese, alt: 'Japanese cuisine'},
      displayOrder: 5,
    },
    {name: 'Chinese', image: {url: cuisineImages.chinese, alt: 'Chinese cuisine'}, displayOrder: 6},
    {name: 'Indian', image: {url: cuisineImages.indian, alt: 'Indian cuisine'}, displayOrder: 7},
    {
      name: 'Steakhouse',
      image: {url: cuisineImages.steakhouse, alt: 'Steakhouse'},
      displayOrder: 8,
    },
    {name: 'Vegan', image: {url: cuisineImages.vegan, alt: 'Vegan cuisine'}, displayOrder: 9},
    {
      name: 'Pacific Rim',
      image: {url: cuisineImages.pacificRim, alt: 'Pacific Rim cuisine'},
      displayOrder: 10,
    },
  ].map(c => ({...c, slug: generateSlug(c.name)}));

  await Category.deleteMany({});
  return await Category.insertMany(categories);
};

const seedRestaurants = async areas => {
  const areaMap = {};
  areas.forEach(area => {
    areaMap[area.name] = area._id;
  });

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

  const defaultTimeSlots = [
    {time: '19:00', available: true, points: 1000},
    {time: '19:15', available: true, points: 1000},
    {time: '19:30', available: true, points: 1000},
    {time: '19:45', available: true, points: 1000},
    {time: '20:00', available: true, points: 1000},
  ];

  const restaurants = [
    // Award-winning restaurants (from Screenshot 1)
    {
      name: 'Benares',
      images: [
        {url: restaurantImages.benares, alt: 'Benares restaurant interior', isPrimary: true},
      ],
      cuisine: 'Indian',
      priceLevel: '££££',
      rating: 4.6,
      reviewCount: 2847,
      area: areaMap.Mayfair,
      areaName: 'Mayfair',
      distance: {value: 750, unit: 'yd', display: '750 yd'},
      badges: ['Award-winning', 'Promoted'],
      isAwardWinning: true,
      isPromoted: true,
      timeSlots: defaultTimeSlots,
      description: 'Michelin-starred modern Indian cuisine in the heart of Mayfair.',
    },
    {
      name: 'Hakkasan Mayfair',
      images: [{url: restaurantImages.hakkasan, alt: 'Hakkasan restaurant', isPrimary: true}],
      cuisine: 'Chinese',
      priceLevel: '££££',
      rating: 4.5,
      reviewCount: 4521,
      area: areaMap.Mayfair,
      areaName: 'Mayfair',
      distance: {value: 800, unit: 'yd', display: '800 yd'},
      badges: ['Award-winning'],
      isAwardWinning: true,
      timeSlots: defaultTimeSlots,
      description: 'Michelin-starred Cantonese cuisine with stunning interiors.',
    },
    // Outdoor dining restaurants (from Screenshot 1)
    {
      name: 'Engawa Restaurant',
      images: [{url: restaurantImages.engawa, alt: 'Engawa restaurant', isPrimary: true}],
      cuisine: 'Japanese',
      priceLevel: '££££',
      rating: 3.9,
      reviewCount: 1234,
      area: areaMap.Piccadilly,
      areaName: 'Piccadilly',
      distance: {value: 150, unit: 'yd', display: '150 yd'},
      badges: ['Promoted'],
      isPromoted: true,
      hasOutdoorDining: true,
      timeSlots: defaultTimeSlots,
      description: 'Traditional Japanese dining with outdoor seating.',
    },
    {
      name: 'The Ivy Soho Brasserie',
      images: [{url: restaurantImages.ivy, alt: 'The Ivy Soho Brasserie', isPrimary: true}],
      cuisine: 'British',
      priceLevel: '££',
      rating: 4.5,
      reviewCount: 11504,
      area: areaMap.Soho,
      areaName: 'Soho',
      distance: {value: 450, unit: 'yd', display: '450 yd'},
      hasOutdoorDining: true,
      timeSlots: defaultTimeSlots,
      rank: {topBooked: 2, topViewed: 2, topSaved: 2},
      stats: {weeklyBookings: 1850, weeklyViews: 12500, weeklySaves: 890},
      description: 'All-day British dining in the heart of Soho.',
    },
    // Top restaurants this week (from Screenshot 2)
    {
      name: 'Balthazar London',
      images: [{url: restaurantImages.balthazar, alt: 'Balthazar London', isPrimary: true}],
      cuisine: 'French',
      priceLevel: '£££',
      rating: 4.4,
      reviewCount: 5859,
      area: areaMap['Covent Garden'],
      areaName: 'Covent Garden',
      distance: {value: 0.65, unit: 'mi', display: '0.65 mi'},
      rank: {topBooked: 1, topViewed: 1, topSaved: 1},
      stats: {weeklyBookings: 2100, weeklyViews: 15000, weeklySaves: 1200},
      timeSlots: defaultTimeSlots,
      description: 'Iconic French brasserie in Covent Garden.',
    },
    {
      name: "Cecconi's",
      images: [{url: restaurantImages.cecconis, alt: "Cecconi's restaurant", isPrimary: true}],
      cuisine: 'Italian',
      priceLevel: '£££',
      rating: 4.3,
      reviewCount: 3257,
      area: areaMap.Mayfair,
      areaName: 'Mayfair',
      distance: {value: 400, unit: 'yd', display: '400 yd'},
      rank: {topBooked: 3, topViewed: 3, topSaved: 3},
      stats: {weeklyBookings: 1650, weeklyViews: 11000, weeklySaves: 780},
      timeSlots: defaultTimeSlots,
      description: 'Classic Italian restaurant with Venetian influences.',
    },
    {
      name: 'Los Mochis London City',
      images: [{url: restaurantImages.losMochis, alt: 'Los Mochis', isPrimary: true}],
      cuisine: 'Pacific Rim',
      priceLevel: '££££',
      rating: 4.4,
      reviewCount: 1507,
      area: areaMap['Liverpool Street'],
      areaName: 'Liverpool Street',
      distance: {value: 2.3, unit: 'mi', display: '2.3 mi'},
      rank: {topBooked: 4, topViewed: 4, topSaved: 4},
      stats: {weeklyBookings: 1400, weeklyViews: 9500, weeklySaves: 650},
      timeSlots: defaultTimeSlots,
      description: 'Japanese-Mexican fusion in the City.',
    },
    {
      name: 'Hawksmoor Air Street',
      images: [{url: restaurantImages.hawksmoor, alt: 'Hawksmoor', isPrimary: true}],
      cuisine: 'Steakhouse',
      priceLevel: '£££',
      rating: 4.6,
      reviewCount: 14015,
      area: areaMap.Piccadilly,
      areaName: 'Piccadilly',
      distance: {value: 90, unit: 'yd', display: '90 yd'},
      rank: {topBooked: 5, topViewed: 5, topSaved: 5},
      stats: {weeklyBookings: 1300, weeklyViews: 8800, weeklySaves: 590},
      timeSlots: defaultTimeSlots,
      description: 'Award-winning steakhouse with British beef.',
    },
    // Featured restaurants (from Screenshot 3)
    {
      name: "Quaglino's",
      images: [{url: restaurantImages.quaglinos, alt: "Quaglino's restaurant", isPrimary: true}],
      cuisine: 'Contemporary',
      priceLevel: '££££',
      rating: 4.1,
      reviewCount: 3890,
      area: areaMap.Piccadilly,
      areaName: 'Piccadilly',
      distance: {value: 450, unit: 'yd', display: '450 yd'},
      isFeatured: true,
      rewardPoints: 1000,
      timeSlots: defaultTimeSlots,
      description: 'Grand European restaurant with live music.',
    },
    {
      name: 'ROBATA',
      images: [{url: restaurantImages.robata, alt: 'ROBATA restaurant', isPrimary: true}],
      cuisine: 'Japanese',
      priceLevel: '£££',
      rating: 4.3,
      reviewCount: 1245,
      area: areaMap.Soho,
      areaName: 'Soho',
      distance: {value: 350, unit: 'yd', display: '350 yd'},
      isFeatured: true,
      rewardPoints: 1000,
      timeSlots: defaultTimeSlots,
      description: 'Japanese robatayaki grill.',
    },
    // New to Bookable (from Screenshot 3)
    {
      name: 'Purezza Camden',
      images: [{url: restaurantImages.purezza, alt: 'Purezza Camden', isPrimary: true}],
      cuisine: 'Vegan',
      priceLevel: '££',
      rating: 4.7,
      reviewCount: 892,
      area: areaMap.Camden,
      areaName: 'Camden',
      distance: {value: 2, unit: 'mi', display: '2 mi'},
      badges: ['Promoted'],
      isPromoted: true,
      isNewToBookable: true,
      timeSlots: [
        {time: '19:15', available: true, points: 0},
        {time: '20:00', available: true, points: 0},
      ],
      description: "UK's first vegan pizzeria.",
    },
    {
      name: "Harry's Covent Garden",
      images: [{url: restaurantImages.harrys, alt: "Harry's Covent Garden", isPrimary: true}],
      cuisine: 'Italian',
      priceLevel: '££',
      rating: 4.4,
      reviewCount: 2156,
      area: areaMap['Covent Garden'],
      areaName: 'Covent Garden',
      distance: {value: 0.5, unit: 'mi', display: '0.5 mi'},
      isNewToBookable: true,
      timeSlots: [
        {time: '18:45', available: true, points: 0},
        {time: '19:30', available: true, points: 0},
      ],
      description: 'Classic Italian-American bar and restaurant.',
    },
    // Wine tasting (from Screenshot 7)
    {
      name: 'The Crusting Pipe',
      images: [{url: restaurantImages.crustingPipe, alt: 'The Crusting Pipe', isPrimary: true}],
      cuisine: 'British',
      priceLevel: '£££',
      rating: 4.1,
      reviewCount: 1678,
      area: areaMap['Covent Garden'],
      areaName: 'Covent Garden',
      distance: {value: 0.55, unit: 'mi', display: '0.55 mi'},
      features: ['Wine tasting'],
      timeSlots: [{time: '19:00', available: true, points: 0}],
      description: 'Wine bar and restaurant in Covent Garden.',
    },
    {
      name: "Davy's Wine Vaults",
      images: [{url: restaurantImages.davysWine, alt: "Davy's Wine Vaults", isPrimary: true}],
      cuisine: 'British',
      priceLevel: '£££',
      rating: 4.2,
      reviewCount: 1234,
      area: areaMap['Charing Cross'],
      areaName: 'Charing Cross',
      distance: {value: 0.4, unit: 'mi', display: '0.4 mi'},
      features: ['Wine tasting'],
      timeSlots: [
        {time: '19:15', available: true, points: 0},
        {time: '19:30', available: true, points: 0},
      ],
      description: 'Historic wine bar with extensive cellar.',
    },
    // Book for tonight (from Screenshot 6)
    {
      name: 'Bocconcino Mayfair',
      images: [{url: restaurantImages.bocconcino, alt: 'Bocconcino Mayfair', isPrimary: true}],
      cuisine: 'Italian',
      priceLevel: '££££',
      rating: 4.3,
      reviewCount: 2567,
      area: areaMap.Mayfair,
      areaName: 'Mayfair',
      distance: {value: 650, unit: 'yd', display: '650 yd'},
      badges: ['Promoted'],
      isPromoted: true,
      isFeatured: true,
      rewardPoints: 1000,
      timeSlots: defaultTimeSlots,
      description: 'Authentic Neapolitan pizzeria in Mayfair.',
    },
  ];

  // Add slugs and location to all restaurants
  const restaurantsWithData = restaurants.map(r => ({
    ...r,
    slug: generateSlug(r.name),
    location: getLocation(r.areaName),
  }));

  await Restaurant.deleteMany({});
  return await Restaurant.insertMany(restaurantsWithData);
};

const seedExperiences = async () => {
  const experiences = [
    {
      title: 'Wellington Beef Experience',
      description: 'Experience the finest beef wellington preparation at the table.',
      image: {url: restaurantImages.experience, alt: 'Beef Wellington'},
      type: 'dining',
      isFeatured: true,
      displayOrder: 1,
    },
    {
      title: 'Wine Tasting Evening',
      description: 'A curated selection of fine wines paired with canapés.',
      image: {url: restaurantImages.davysWine, alt: 'Wine tasting'},
      type: 'tasting',
      isFeatured: true,
      displayOrder: 2,
    },
    {
      title: 'Afternoon Tea Experience',
      description: 'Traditional afternoon tea with a modern twist.',
      image: {url: restaurantImages.crustingPipe, alt: 'Afternoon tea'},
      type: 'dining',
      isFeatured: true,
      displayOrder: 3,
    },
  ];

  const experiencesWithSlugs = experiences.map(e => ({...e, slug: generateSlug(e.title)}));

  await Experience.deleteMany({});
  return await Experience.insertMany(experiencesWithSlugs);
};

const seedPromotions = async () => {
  const promotions = [
    {
      title: 'Discover Pan-Asian cuisine with Cobra Beer',
      subtitle: 'Explore our curated selection of Pan-Asian restaurants.',
      image: {url: promotionImages.cobraBeer, alt: 'Pan-Asian cuisine'},
      type: 'get-inspired',
      displayOrder: 1,
    },
    {
      title: 'The No Reservation List - Now Available',
      subtitle: 'Walk-in restaurants with immediate availability.',
      image: {url: promotionImages.noReservation, alt: 'No reservation'},
      type: 'get-inspired',
      displayOrder: 2,
    },
  ];

  await Promotion.deleteMany({});
  return await Promotion.insertMany(promotions);
};

const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🌱 Seeding areas...');
    const areas = await seedAreas();
    console.log(`✅ Seeded ${areas.length} areas`);

    console.log('🌱 Seeding categories...');
    const categories = await seedCategories();
    console.log(`✅ Seeded ${categories.length} categories`);

    console.log('🌱 Seeding restaurants...');
    const restaurants = await seedRestaurants(areas);
    console.log(`✅ Seeded ${restaurants.length} restaurants`);

    console.log('🌱 Seeding experiences...');
    const experiences = await seedExperiences();
    console.log(`✅ Seeded ${experiences.length} experiences`);

    console.log('🌱 Seeding promotions...');
    const promotions = await seedPromotions();
    console.log(`✅ Seeded ${promotions.length} promotions`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nCollections created:');
    console.log('  - bookable-areas');
    console.log('  - bookable-categories');
    console.log('  - bookable-restaurants');
    console.log('  - bookable-experiences');
    console.log('  - bookable-promotions');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
