const express = require('express');
const {createCategory,getCategories} = require('../controllers/category-controller');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');

const router = express.Router();

router.post('/create',authMiddleware,adminMiddleware,createCategory);
router.get('/get',authMiddleware,getCategories);

module.exports = router;