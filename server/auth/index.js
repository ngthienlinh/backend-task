const passport = require('passport')
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const express = require('express')
const { validateNewUser } = require("../validators/user")
const { generateSalt, encodePassword } = require('./auth.service')
const router = express.Router()

router.post('/signin', passport.authenticate('local'), (req, res, next) => {
  // we need to call req.login to complete passport login process
  req.login(req.user, (err) => {
    if (err) {
      res.status(500).json({ message: 'Session save went bad.' });
      return;
    }
    req.session.userId = req.userId
    req.session.save(function (err) {
      res.json(req.user)
    })
  });
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
      req.login(req.user, (err) => {
        if (err) {
          res.status(500).json({ message: 'Session save went bad.' });
          return;
        }
        req.session.userId = req.userId
        req.session.save(function (err) {
          if (err) {
            return res.status(500).json({ message: 'Fail to save session.' });
          }
          res.json(req.user)
        })
      });
    })

    res.json({ email: req.body.email })
  } catch (ex) {
    console.log(ex)
    res.sendStatus(500)
  }
})

router.get('/signout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }

    res.json({ msg: 'OK' });
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