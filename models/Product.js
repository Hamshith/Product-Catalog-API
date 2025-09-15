const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String ,
        required : true
    },
    price : {
        type  :Number,
        required : true
    },
    stock : {
        type : Number,
        default : 0
    },
    categoryId : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'Category',
        required : true
    },
    imageURL : {
        type : String,
        required : true
    },
    imagePublicId : {
        type : String,
        required : true
    }
},{timestamps:true});

module.exports = mongoose.model('Product',ProductSchema);