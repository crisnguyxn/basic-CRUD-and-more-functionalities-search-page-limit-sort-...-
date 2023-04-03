const express = require('express')
const { getAllProduct, getOne, createProduct, updateProduct, deleteProduct } = require('../controllers/product')
const router = express.Router()

router.route('/').get(getAllProduct)
router.route('/:id').get(getOne)
router.route('/').post(createProduct)
router.route('/:id').patch(updateProduct)
router.route('/:id').delete(deleteProduct)

module.exports = router