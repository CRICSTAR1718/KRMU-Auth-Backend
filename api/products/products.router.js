const express = require('express')
const authMiddleware = require('../../middleware/auth-validation.middleware')
const createProductDTO = require('./dto/create-product.dto')
const updateProductDTO = require('./dto/update-product.dto')
const { getProducts, createProduct, updateProduct } = require('./products.controllers')

const router = express.Router()

router.get('/', getProducts)

router.use(authMiddleware)

router.post('/', createProductDTO, createProduct)
router.patch('/:productId', updateProductDTO, updateProduct)

module.exports = router
