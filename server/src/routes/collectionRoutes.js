const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');

router.get('/', collectionController.getCollections);
router.get('/:type', collectionController.getCollectionByType);

module.exports = router;

