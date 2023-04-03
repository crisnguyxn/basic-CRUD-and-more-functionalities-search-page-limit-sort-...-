const { customHandlerError } = require('../errors/custom-error')
const asyncWrapper = require('../middlewares/async')
const Product = require('../models/product')
const getAllProduct = asyncWrapper( async (req,res) => {
    const products = await Product.find({})
    res.status(200).json({products})
})

const getOne = asyncWrapper(async(req,res,next) => {
    const {id:productID} = req.params
    const product = await Product.findOne({_id:productID})
    if(!product){
        return next(customHandlerError(`The product with id:${productID} is not existed`,404))
    }
    res.status(200).json({product})
})

const createProduct = asyncWrapper (async (req,res,next) => {
    const product = await Product.create(req.body)
    res.status(201).json({product})  
})

const updateProduct = asyncWrapper(async (req,res,next) => {
    const {id:productID} = req.params
    const product = await Product.findOneAndUpdate({_id:productID},req.body,{
        new:true,
        runValidators:true
    })
    if(!product){
        return next(customHandlerError(`The product with id:${productID} is not existed`,404))
    }
    res.status(200).json({product})
})

const deleteProduct = asyncWrapper(async (req,res,next) => {
    const {id:productID} = req.params
    const product = await Product.findOneAndDelete({_id:productID})
    if(!product){
        return next(customHandlerError(`The product with id:${productID} is not existed`,404))
    }
    res.status(200).json({product})
})

module.exports = {
    getAllProduct,getOne,createProduct,updateProduct,deleteProduct
}