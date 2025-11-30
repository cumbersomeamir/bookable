const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Get all home page data in one optimized call
router.get('/', homeController.getHomeData);

module.exports = router;

