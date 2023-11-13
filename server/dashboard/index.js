'use strict'

const express = require('express')
const controller = require('./dashboard.controller')
const auth = require('../auth/auth.service')

const router = express.Router()

router.get('/sessions', auth.isAuthenticated(), controller.findSessions)

module.exports = router