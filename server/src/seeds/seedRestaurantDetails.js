require('dotenv').config({path: require('path').resolve(__dirname, '../../../server.env')});
const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Review = require('../models/Review');
const RestaurantExperience = require('../models/RestaurantExperience');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not set in server.env');
  process.exit(1);
}

// Food images
const foodImages = {
  pizza: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80',
  lobster: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&q=80',
  tiramisu: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80',
  pasta: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80',
  steak: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80',
  seafood: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&q=80',
  brunch: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&q=80',
  wine: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
  truffle: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80',
};

// Update restaurants with detail information
const updateRestaurantDetails = async () => {
  const restaurants = await Restaurant.find({});

  for (const restaurant of restaurants) {
    // Generate detailed data based on restaurant name
    const updates = {
      priceRange:
        restaurant.priceLevel === '££££'
          ? '£41 and over'
          : restaurant.priceLevel === '£££'
          ? '£31 - £40'
          : restaurant.priceLevel === '££'
          ? '£15 - £30'
          : 'Under £15',
      fullAddress: `${Math.floor(Math.random() * 100) + 1} ${
        restaurant.areaName
      } Street, London, W1${String.fromCharCode(65 + Math.floor(Math.random() * 10))} ${Math.floor(
        Math.random() * 9,
      )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(
        65 + Math.floor(Math.random() * 26),
      )}`,
      photoCount: Math.floor(Math.random() * 500) + 100,
      detailedRatings: {
        food: Math.round((restaurant.rating + (Math.random() * 0.4 - 0.2)) * 10) / 10,
        service: Math.round((restaurant.rating + (Math.random() * 0.4 - 0.2)) * 10) / 10,
        ambience: Math.round((restaurant.rating + (Math.random() * 0.3 - 0.1)) * 10) / 10,
        value: Math.round((restaurant.rating - 0.3 + Math.random() * 0.4) * 10) / 10,
      },
      ratingDistribution: {
        five: Math.floor(restaurant.reviewCount * 0.5),
        four: Math.floor(restaurant.reviewCount * 0.25),
        three: Math.floor(restaurant.reviewCount * 0.12),
        two: Math.floor(restaurant.reviewCount * 0.08),
        one: Math.floor(restaurant.reviewCount * 0.05),
      },
      reviewSummary: `${restaurant.name} offers a "perfect dining experience" with "excellent food and impeccable service." The ambiance is "elegant yet relaxed," making it a great spot for special occasions. Standout dishes include the signature menu items and seasonal selections, paired with an "impressive wine list." "Highly recommended" for authentic ${restaurant.cuisine} cuisine.`,
      todayBookings: Math.floor(Math.random() * 100) + 20,
      conciergeEnabled: true,
    };

    // Update specific restaurants with real addresses
    if (restaurant.name === 'Bocconcino Mayfair') {
      updates.fullAddress = '19 Berkeley Street, London, W1J 8ED';
      updates.photoCount = 638;
      updates.todayBookings = 68;
    }

    await Restaurant.updateOne({_id: restaurant._id}, {$set: updates});
  }

  console.log(`✅ Updated ${restaurants.length} restaurants with detail info`);
  return restaurants;
};

// Seed menu items
const seedMenuItems = async restaurants => {
  const menuItemsData = [];

  for (const restaurant of restaurants) {
    const cuisineMenus = {
      Italian: [
        {
          name: 'Pizza Bocconcino',
          description: 'Stracchino mozzarella fresh tomatoes Parma ham',
          image: foodImages.pizza,
          isPopular: true,
          photoCount: 1,
          reviewCount: 8,
        },
        {
          name: 'Lobster',
          description: 'Fresh Atlantic lobster with herb butter',
          image: foodImages.lobster,
          isPopular: true,
          photoCount: 1,
          reviewCount: 3,
        },
        {
          name: 'Tiramisù',
          description: 'Coffee flavoured dessert with biscuits & whipped mascarpone cream',
          image: foodImages.tiramisu,
          isPopular: true,
          photoCount: 1,
          reviewCount: 6,
        },
        {
          name: 'Truffle Pasta',
          description: 'Fresh pasta with black truffle shavings',
          image: foodImages.truffle,
          isPopular: false,
          photoCount: 2,
          reviewCount: 4,
        },
      ],
      Japanese: [
        {
          name: 'Omakase Selection',
          description: "Chef's selection of finest sashimi",
          image: foodImages.seafood,
          isPopular: true,
          photoCount: 3,
          reviewCount: 12,
        },
        {
          name: 'Wagyu Beef',
          description: 'A5 grade Japanese Wagyu, grilled to perfection',
          image: foodImages.steak,
          isPopular: true,
          photoCount: 2,
          reviewCount: 8,
        },
        {
          name: 'Mochi Ice Cream',
          description: 'Assorted Japanese rice cake desserts',
          image: foodImages.tiramisu,
          isPopular: true,
          photoCount: 1,
          reviewCount: 5,
        },
      ],
      British: [
        {
          name: 'Roast Beef',
          description: 'Aged British beef with Yorkshire pudding',
          image: foodImages.steak,
          isPopular: true,
          photoCount: 2,
          reviewCount: 15,
        },
        {
          name: 'Fish and Chips',
          description: 'Beer battered cod with triple cooked chips',
          image: foodImages.seafood,
          isPopular: true,
          photoCount: 1,
          reviewCount: 10,
        },
        {
          name: 'Sticky Toffee Pudding',
          description: 'Classic British dessert with toffee sauce',
          image: foodImages.tiramisu,
          isPopular: true,
          photoCount: 1,
          reviewCount: 7,
        },
      ],
      French: [
        {
          name: 'Steak Frites',
          description: 'Prime ribeye with pommes frites',
          image: foodImages.steak,
          isPopular: true,
          photoCount: 2,
          reviewCount: 18,
        },
        {
          name: 'Fruits de Mer',
          description: 'Seafood platter with oysters and lobster',
          image: foodImages.seafood,
          isPopular: true,
          photoCount: 3,
          reviewCount: 12,
        },
        {
          name: 'Crème Brûlée',
          description: 'Classic vanilla custard with caramelized sugar',
          image: foodImages.tiramisu,
          isPopular: true,
          photoCount: 1,
          reviewCount: 9,
        },
      ],
    };

    const defaultMenu = [
      {
        name: "Chef's Special",
        description: 'Daily changing signature dish',
        image: foodImages.pasta,
        isPopular: true,
        photoCount: 2,
        reviewCount: 10,
      },
      {
        name: 'Seasonal Seafood',
        description: 'Fresh catch of the day',
        image: foodImages.seafood,
        isPopular: true,
        photoCount: 1,
        reviewCount: 6,
      },
      {
        name: 'House Dessert',
        description: 'Signature sweet creation',
        image: foodImages.tiramisu,
        isPopular: true,
        photoCount: 1,
        reviewCount: 4,
      },
    ];

    const menuItems = cuisineMenus[restaurant.cuisine] || defaultMenu;

    menuItems.forEach((item, index) => {
      menuItemsData.push({
        restaurant: restaurant._id,
        name: item.name,
        description: item.description,
        image: {url: item.image, alt: item.name},
        category: item.isPopular ? 'popular' : 'main',
        isPopular: item.isPopular,
        photoCount: item.photoCount,
        reviewCount: item.reviewCount,
        displayOrder: index,
      });
    });
  }

  await MenuItem.deleteMany({});
  await MenuItem.insertMany(menuItemsData);
  console.log(`✅ Seeded ${menuItemsData.length} menu items`);
};

// Seed reviews
const seedReviews = async restaurants => {
  const reviewsData = [];
  const reviewTemplates = [
    {
      title: 'Exceptional experience',
      content:
        "One of the best meals I've had in London. The service was impeccable and the food was outstanding. Will definitely be returning!",
      rating: 5,
    },
    {
      title: 'Great food, lovely atmosphere',
      content:
        'Really enjoyed our dinner here. The ambiance was perfect for a special occasion and the menu had something for everyone.',
      rating: 4,
    },
    {
      title: 'Solid choice',
      content:
        'Good food and decent service. Prices are fair for the quality. Would recommend for a nice night out.',
      rating: 4,
    },
    {
      title: 'Perfect for celebrations',
      content:
        'We came here for an anniversary dinner and were not disappointed. The staff made us feel special throughout the evening.',
      rating: 5,
    },
    {
      title: 'Lovely meal',
      content:
        'Fresh ingredients, creative dishes, and attentive staff. The wine pairing was excellent too.',
      rating: 4,
    },
  ];

  const names = [
    'Sarah M.',
    'James T.',
    'Emma W.',
    'Oliver P.',
    'Charlotte R.',
    'William H.',
    'Sophia L.',
    'Henry B.',
  ];
  const locations = ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Bristol', 'Oxford'];

  for (const restaurant of restaurants) {
    const numReviews = Math.min(5, Math.floor(Math.random() * 5) + 2);

    for (let i = 0; i < numReviews; i++) {
      const template = reviewTemplates[i % reviewTemplates.length];
      reviewsData.push({
        restaurant: restaurant._id,
        user: {
          name: names[Math.floor(Math.random() * names.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
        },
        ratings: {
          overall: template.rating,
          food: template.rating + (Math.random() > 0.5 ? 0 : -1),
          service: template.rating,
          ambience: template.rating,
          value: template.rating - 1,
        },
        title: template.title,
        content: template.content,
        visitDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
        visitType: ['dinner', 'lunch', 'brunch'][Math.floor(Math.random() * 3)],
        isVerified: true,
        helpfulCount: Math.floor(Math.random() * 20),
      });
    }
  }

  await Review.deleteMany({});
  await Review.insertMany(reviewsData);
  console.log(`✅ Seeded ${reviewsData.length} reviews`);
};

// Seed restaurant experiences
const seedExperiences = async restaurants => {
  const experiencesData = [];

  const experienceTemplates = [
    {
      title: 'Brunch Esclusivo: Bottomless Brunch & Live Music',
      description:
        "Join us for Bottomless Brunch Esclusivo - London's best brunch - with Italian dishes",
      priceMin: 50,
      priceMax: 79,
      image: foodImages.brunch,
    },
    {
      title: 'Truffle Tasting Experience',
      description: 'A unique journey through the world of truffles with our expert sommelier',
      priceMin: 85,
      priceMax: 120,
      image: foodImages.truffle,
    },
    {
      title: 'Wine & Dine Evening',
      description: 'Five-course tasting menu paired with premium wines',
      priceMin: 95,
      priceMax: 145,
      image: foodImages.wine,
    },
  ];

  for (const restaurant of restaurants) {
    // Add 1-2 experiences per restaurant
    const numExperiences = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < numExperiences; i++) {
      const template = experienceTemplates[i % experienceTemplates.length];
      experiencesData.push({
        restaurant: restaurant._id,
        title: template.title,
        description: template.description,
        image: {url: template.image, alt: template.title},
        price: {
          min: template.priceMin,
          max: template.priceMax,
          currency: 'GBP',
          display: `£${template.priceMin} - £${template.priceMax} per person`,
        },
        availability: {
          hasMultipleDates: true,
          hasMultipleTimes: true,
        },
        displayOrder: i,
      });
    }
  }

  await RestaurantExperience.deleteMany({});
  await RestaurantExperience.insertMany(experiencesData);
  console.log(`✅ Seeded ${experiencesData.length} restaurant experiences`);
};

const seedRestaurantDetails = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🌱 Seeding restaurant details...\n');

    const restaurants = await updateRestaurantDetails();
    await seedMenuItems(restaurants);
    await seedReviews(restaurants);
    await seedExperiences(restaurants);

    console.log('\n🎉 Restaurant details seeding completed successfully!');
    console.log('\nNew collections created/updated:');
    console.log('  - bookable-restaurants (updated with detail fields)');
    console.log('  - bookable-menu-items');
    console.log('  - bookable-reviews');
    console.log('  - bookable-restaurant-experiences');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedRestaurantDetails();
