'use strict'
const passport = require('passport')
const LocalStrategy = require('passport-local')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const cryptoJS = require("crypto-js")

exports.generateSalt = () => {
  let salt = cryptoJS.lib.WordArray.random(16)
  return salt.toString(cryptoJS.enc.Hex)
}

exports.encodePassword = (password, salt) => {
  let pass = cryptoJS.PBKDF2(password, salt, {
    keySize: 64,
    iterations: 1000
  })

  return pass.toString(cryptoJS.enc.Hex)
}

exports.passportSetup = () => {
  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, {
        id: user.id,
        email: user.email,
        name: user.name
      })
    })
  })

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    })
  })

  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        let user = await prisma.user.findUnique({ where: { email: email } })
        if (user) {
          let pass = this.encodePassword(password, user.salt)

          if (user.password === pass) {
            return done(null, { id: user.id, name: user.name, email: user.email })
          }
        }
        return done(null, false, { msg: 'Email and password combination is incorrect. Please try again.' })
      } catch (ex) {
        console.log(ex)
        return done(ex)
      }
    }
  ))

  // passport.use(new GoogleStrategy({
  //   clientID: GOOGLE_CLIENT_ID,
  //   clientSecret: GOOGLE_CLIENT_SECRET,
  //   callbackURL: "http://www.example.com/auth/google/callback"
  // },
  //   async (accessToken, refreshToken, profile, cb) => {
  //     let user = await prisma.user.findUnique({ where: { userId: profile.id } })
  //   }
  // ));
}

exports.isAuthenticated = () => {
  return [
    (req, res, next) => {
      if (req.user) {
        next()
      } else {
        res.sendStatus(404)
      }
    }
  ]
}