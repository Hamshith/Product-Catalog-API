const Category = require('../models/Category');

const createCategory = async(req,res) =>{
    try{
        const {name} = req.body;

        const checkExistingCategory = await Category.findOne({name});
        if(checkExistingCategory){
            return res.status(400).json({
                success : false,
                message  : "Category is already existing"
            });
        }

        const newCategory  = new Category({name});

        await newCategory.save();

        res.status(200).json({
            success  :true , 
            message : "Successfully created new category",
            data : newCategory
        });

    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Something went wrong, Please try again later"
        });
    }
}

const getCategories = async(req,res)=>{
    try{
        const categories = await Category.find({});
        if(categories){
            res.status(200).json({
                success : true,
                data : categories
            })
        }
    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Something went wrong , Please try again later"
        })
    }
}

module.exports = {
    createCategory,
    getCategories
}