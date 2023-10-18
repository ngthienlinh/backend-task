const passport = require('passport')
const LocalStrategy = require('passport-local')
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const express = require('express')
const cryptoJS = require("crypto-js")
const { validateNewUser } = require("../validators/user")

const router = express.Router()

passport.use(new LocalStrategy({ passReqToCallback: true },
    async (req, username, password, done) => {
        let user = await prisma.user.findUnique({ where: { userId: username } })
        if (user) {
            try {
                let pass = cryptoJS.PBKDF2(password, user.salt, {
                    keySize: 64,
                    iterations: 1000
                });

                if (user.password === pass.toString(cryptoJS.enc.Hex)) {
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

    let salt = cryptoJS.lib.WordArray.random(16)
    let pass = cryptoJS.PBKDF2(req.body.password, salt.toString(), {
        keySize: 64,
        iterations: 1000
    })
    await prisma.user.create({
        data: {
            userId: req.body.userId,
            name: req.body.name,
            salt: salt.toString(),
            password: pass.toString()
        }
    })

    res.json({ userId: req.body.userId })
})

module.exports = router