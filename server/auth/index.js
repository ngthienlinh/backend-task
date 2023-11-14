const passport = require('passport')
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const express = require('express')
const { validateNewUser } = require("../validators/user")
const { passportSetup, generateSalt, encodePassword } = require('./auth.service')

passportSetup()

const router = express.Router()

function onUserLoggedIn(req, res, next) {

}

router.post('/signin', passport.authenticate('local'), (req, res, next) => {
  // regenerate the session, which is good practice to help
  // guard against forms of session fixation
  req.session.regenerate(function (err) {
    if (err) next(err)

    // store user information in session, typically a user id
    req.session.userId = req.user.id

    // save the session before redirection to ensure page
    // load does not happen before session is saved
    req.session.save(function (err) {
      if (err) return next(err)

      res.json(req.user)
    })
  })
})

router.post('/signup', validateNewUser(), async (req, res) => {
  try {
    let user = await prisma.user.findUnique({ where: { email: req.body.email } })
    if (user) {
      return res.status(400).json({ msg: 'This email is already in used.' })
    }

    let salt = generateSalt()
    let pass = encodePassword(req.body.password, salt)

    await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        salt: salt,
        password: pass,
        active: true,
        validated: false
      }
    })

    // Log user in after registration
    passport.authenticate('local')(req, res, function () {
      req.session.regenerate(function (err) {
        if (err) next(err)

        // store user information in session, typically a user id
        req.session.userId = req.user.id

        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
          if (err) return next(err)

          res.json(req.user)
        })
      })
    })

    res.json({ email: req.body.email })
  } catch (ex) {
    console.log(ex)
    res.sendStatus(500)
  }
})

router.post('/signout', (req, res) => {
  req.logout(function (err) {
    if (err) { return next(err); }

    res.redirect('/');
  });
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