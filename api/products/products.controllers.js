const { db } = require('../../config/db-config')
const { products } = require('../../schema/product.model')
const { eq } = require('drizzle-orm')

const getProducts = async (req, res) => {
  try {
    console.log(`[GET_PRODUCTS] Fetching all products...`)
    const allProducts = await db.select().from(products)
    console.log(`[GET_PRODUCTS] ✓ Fetched ${allProducts.length} products`)
    return res.status(200).json({ success: true, data: allProducts })
  } catch (err) {
    console.error(`[GET_PRODUCTS] ✗ Error fetching products:`, err.message)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

const createProduct = async (req, res) => {
  try {
    const { name, price, stock, images } = req.body
    const userId = req.user.id

    console.log(`[CREATE_PRODUCT] Creating product - Name: ${name}, Price: ${price}, Stock: ${stock}, User: ${userId}`)

    const newProduct = await db
      .insert(products)
      .values({
        name,
        price,
        stock,
        images: images || [],
        user_id: userId,
      })
      .returning()

    console.log(`[CREATE_PRODUCT] ✓ Product created successfully - ID: ${newProduct[0]?.id}, Name: ${name}, User: ${userId}`)
    return res.status(201).json({ success: true, data: newProduct[0] })
  } catch (err) {
    console.error(`[CREATE_PRODUCT] ✗ Error creating product:`, err.message)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params
    const { name, price, stock, images } = req.body
    const userId = req.user.id

    console.log(`[UPDATE_PRODUCT] Update attempt - Product: ${productId}, User: ${userId}`)

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)

    if (product.length === 0) {
      console.warn(`[UPDATE_PRODUCT] Update failed - Product not found: ${productId}`)
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    if (product[0].user_id !== userId) {
      console.warn(`[UPDATE_PRODUCT] Update failed - Unauthorized access - Product: ${productId}, Owner: ${product[0].user_id}, User: ${userId}`)
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    console.log(`[UPDATE_PRODUCT] Updating product - ID: ${productId}, Changes: name=${name}, price=${price}, stock=${stock}`)

    const updatedProduct = await db
      .update(products)
      .set({
        name: name || product[0].name,
        price: price || product[0].price,
        stock: stock !== undefined ? stock : product[0].stock,
        images: images || product[0].images,
      })
      .where(eq(products.id, productId))
      .returning()

    console.log(`[UPDATE_PRODUCT] ✓ Product updated successfully - ID: ${productId}, User: ${userId}`)
    return res.status(200).json({ success: true, data: updatedProduct[0] })
  } catch (err) {
    console.error(`[UPDATE_PRODUCT] ✗ Error updating product:`, err.message)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

module.exports = { getProducts, createProduct, updateProduct }
