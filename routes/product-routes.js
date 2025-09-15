const express = require('express');
const {createProduct,getAllProducts,getProductById,updateProduct,deleteProduct}  = require('../controllers/product-controller');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const uploadMiddleware = require('../middleware/upload-middleware');

const router = express.Router();

router.post('/create',authMiddleware,adminMiddleware,uploadMiddleware.single('image'),createProduct);
router.get('/get',authMiddleware,getAllProducts);
router.get('/get/:id',authMiddleware,getProductById);
router.put('/update/:id',authMiddleware,adminMiddleware,uploadMiddleware.single('image'),updateProduct);
router.delete('/delete/:id',authMiddleware,adminMiddleware,deleteProduct);

module.exports = router;
