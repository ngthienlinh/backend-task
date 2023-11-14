'use strict'

const express = require('express')
const controller = require('./user.controller')
const auth = require('../auth/auth.service')

const router = express.Router()

router.get('/', auth.isAuthenticated(), controller.getUser)

module.exports = router