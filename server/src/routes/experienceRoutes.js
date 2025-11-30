const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');

router.get('/', experienceController.getExperiences);
router.get('/featured', experienceController.getFeaturedExperiences);

module.exports = router;

