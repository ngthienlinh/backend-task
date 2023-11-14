'use strict'

const express = require('express')
const controller = require('./dashboard.controller')

const router = express.Router()

router.get('/sessions', controller.findSessions)

module.exports = router