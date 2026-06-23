require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const authRouter = require('./api/auth/auth.router')
const productsRouter = require('./api/products/products.router')

const app = express()

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' })
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/products', productsRouter)

const PORT = process.env.PORT || 6101

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
