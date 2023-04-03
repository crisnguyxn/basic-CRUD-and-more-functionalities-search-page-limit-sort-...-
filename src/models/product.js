const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name must be provided'],
        trim:true,
        maxlength:[50,'Maximum of name must be smaller than 50']
    },
    price:{
        type:Number,
        required:[true,'Price must be provided']
    },
    rating:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    featured:{
        type:Boolean,
        default:false
    },
    company:{
        type:String,
        required:[true,'Company must be provided']
    }
})

module.exports = mongoose.model('Product',ProductSchema)