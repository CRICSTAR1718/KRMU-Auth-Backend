const express = require('express')
const registerDTO = require('./dto/register.dto')
const loginDTO = require('./dto/login.dto')
const logoutDTO = require('./dto/logout.dto')
const { registerController, loginController, logoutController } = require('./auth.controllers')

const router = express.Router()

router.post('/register', registerDTO, registerController)
router.post('/login', loginDTO, loginController)
router.post('/logout', logoutDTO, logoutController)

module.exports = router
