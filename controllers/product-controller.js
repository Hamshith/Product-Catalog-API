const Product = require('../models/Product');
const { uploadToCloudinary } = require('../helpers/cloudinary-helper');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const Category = require('../models/Category');

const createProduct = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file"
            });
        }

        const { name, description, price, stock, categoryId } = req.body;

        const checkCategoryId = await Category.findById(categoryId);

        if (!checkCategoryId) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Category ID"
            })
        }

        const { url, publicId } = await uploadToCloudinary(req.file.path);

        const newProduct = new Product({
            name,
            description,
            price,
            stock: stock || 0,
            categoryId,
            imageURL: url,
            imagePublicId: publicId
        });

        await newProduct.save();

        fs.unlinkSync(req.file.path);

        res.status(200).json({
            success: true,
            message: "Successfully created a product",
            data: newProduct
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong, Please try again later"
        });
    }
}

const getAllProducts = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;


        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Product.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);

        const sortObj = {}
        sortObj[sortBy] = sortOrder;

        const products = await Product.find().sort(sortObj).skip(skip).limit(limit);
        if (products) {
            res.status(200).json({
                success: true,
                data: products
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong, Please try again later"
        });
    }
}

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (product) {
            res.status(200).json({
                success: true,
                data: product
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong, Please try again later"
        });
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const checkProduct = await Product.findById(productId);
        if (!checkProduct) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        if (req.file) {
            await cloudinary.uploader.destroy(checkProduct.imagePublicId);

            const { url, publicId } = await uploadToCloudinary(req.file.path);

            checkProduct.imageURL = url;
            checkProduct.imagePublicId = publicId;

            fs.unlinkSync(req.file.path);
        }

        const fieldsToUpdate = Object.keys(req.body);

        if (req.body.categoryId) {
            const checkCategoryId = await Category.findById(req.body.categoryId);

            if (!checkCategoryId) {
                return res.status(400).json({
                    success: false,
                    message: "Incorrect Category ID"
                });
            }
        }

        fieldsToUpdate.forEach(element => {
            if (element in checkProduct) {
                checkProduct[element] = req.body[element];
            }
        });

        await checkProduct.save();

        res.status(200).json({
            success: true,
            data: checkProduct
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong, Please try again later"
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const checkProduct = await Product.findById(productId);

        if (!checkProduct) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        await cloudinary.uploader.destroy(checkProduct.imagePublicId);

        await Product.findByIdAndDelete(productId);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong, Please try again later"
        });
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};