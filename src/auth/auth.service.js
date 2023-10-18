'use strict'
const passport = require('passport')
const LocalStrategy = require('passport-local')
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
    console.log('passportSetup')
    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, {
                id: user.id,
                userId: user.userId,
                username: user.name
            })
        })
    })

    passport.deserializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user);
        })
    })

    passport.use(new LocalStrategy({ passReqToCallback: true },
        async (req, username, password, done) => {
            let user = await prisma.user.findUnique({ where: { userId: username } })
            if (user) {
                try {

                    let pass = this.encodePassword(password, user.salt)

                    if (user.password === pass) {
                        return done(null, { name: user.name, userId: user.userId })
                    }
                } catch (ex) {
                    console.log(ex)
                    return done(null, false, { msg: 'Fail to authenticate user' })
                }
            }
            return done(null, false, { msg: 'Email / phone number / password combination is incorrect. Please try again.' })
        }
    ))
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