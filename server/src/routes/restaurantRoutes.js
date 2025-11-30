const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/', restaurantController.getRestaurants);
router.get('/award-winning', restaurantController.getAwardWinning);
router.get('/outdoor-dining', restaurantController.getOutdoorDining);
router.get('/featured', restaurantController.getFeatured);
router.get('/new', restaurantController.getNewToBookable);
router.get('/top', restaurantController.getTopRestaurants);
router.get('/wine-tasting', restaurantController.getWineTasting);
router.get('/book-tonight', restaurantController.getBookTonight);
router.get('/:id', restaurantController.getRestaurantById);

module.exports = router;

