const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { db } = require('../../config/db-config')
const { users } = require('../../schema/user.model')
const { eq } = require('drizzle-orm')

const registerController = async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(`[REGISTER] New registration attempt for email: ${email}`)

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      console.warn(`[REGISTER] Registration failed - User already exists: ${email}`)
      return res.status(409).json({ success: false, message: 'User already exists!' })
    }

    console.log(`[REGISTER] Email ${email} not found, proceeding with hashing...`)
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(`[REGISTER] Password hashed successfully for ${email}`)

    const newUser = await db.insert(users).values({
      email,
      password: hashedPassword,
    }).returning()

    console.log(`[REGISTER] ✓ User registered successfully - ID: ${newUser[0]?.id}, Email: ${email}`)
    return res.status(201).json({ success: true, message: 'User registered successfully!' })
  } catch (err) {
    console.error(`[REGISTER] ✗ Error during registration:`, err.message)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(`[LOGIN] Login attempt for email: ${email}`)

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (user.length === 0) {
      console.warn(`[LOGIN] Login failed - User not found: ${email}`)
      return res.status(404).json({ success: false, message: 'User not found!' })
    }

    console.log(`[LOGIN] User found - ${email}, verifying password...`)
    const isPasswordMatch = await bcrypt.compare(password, user[0].password)

    if (!isPasswordMatch) {
      console.warn(`[LOGIN] Login failed - Incorrect password for user: ${email}`)
      return res.status(401).json({ success: false, message: 'Incorrect password!' })
    }

    console.log(`[LOGIN] Password verified for ${email}, generating JWT...`)
    const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })

    console.log(`[LOGIN] ✓ Login successful - User ID: ${user[0].id}, Email: ${email}`)
    return res.status(200).json({ success: true, message: 'Login successful!' })
  } catch (err) {
    console.error(`[LOGIN] ✗ Error during login:`, err.message)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

const logoutController = (req, res) => {
  const userId = req.user?.id || 'unknown'
  console.log(`[LOGOUT] Logout request from user: ${userId}`)

  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  })

  console.log(`[LOGOUT] ✓ User logged out successfully - User ID: ${userId}`)
  return res.status(200).json({ success: true, message: 'Logged out successfully!' })
}

module.exports = { registerController, loginController, logoutController }
