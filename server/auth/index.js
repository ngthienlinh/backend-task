const passport = require('passport')
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const express = require('express')
const { validateNewUser } = require("../validators/user")
const { passportSetup, generateSalt, encodePassword } = require('./auth.service')

passportSetup()

const router = express.Router()

router.post('/signin', passport.authenticate('local', { failWithError: true }), (req, res) => {
  res.redirect('http://localhost:3001/dashboard.html');
}, (err, req, res, next) => {
  res.sendStatus(404)
})

router.post('/signup', validateNewUser(), async (req, res) => {
  let user = await prisma.user.findUnique({ where: { userId: req.body.userId } })
  if (user) {
    return res.status(400).json({ msg: 'This email is already in used.' })
  }

  let salt = generateSalt()
  let pass = encodePassword(req.body.password, salt)

  await prisma.user.create({
    data: {
      userId: req.body.userId,
      name: req.body.name,
      salt: salt,
      password: pass
    }
  })

  res.json({ userId: req.body.userId })
})

router.post('/signout', (req, res) => {
  res.redirect('/');
}, (err, req, res, next) => {
  res.sendStatus(404)
})

// router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

// router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

module.exports = router