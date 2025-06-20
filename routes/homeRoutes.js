const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Home overview data
router.get('/', homeController.getHomeData);

module.exports = router;
