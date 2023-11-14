const express = require("express")
const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const path = require('path')
const passport = require('passport')
const { passportSetup } = require('./auth/auth.service')

require('dotenv').config()
const root = path.normalize(__dirname + '/..')
passportSetup()

const app = express()

// Basic secure for server
app.use(helmet())

// Compress response bodies
app.use(compression())
app.use(cookieParser())
// Parse request body
app.use(bodyParser.urlencoded({
  limit: '500kb',
  extended: true,
  parameterLimit: 2000
}))
app.use(bodyParser.json({ limit: '500kb' }));
app.use(bodyParser.text({ type: "text/plain" }));

app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? [/^http:\/\/localhost/] : [/\.ngthienlinh\.com$/],
  optionsSuccessStatus: 200,
  methods: 'GET,PUT,POST,DELETE',
  maxAge: 1800,
  preflightContinue: false,
  credentials: true
}))

app.use(session({
  secret: process.env.SESSION_SECRET || '5pring',
  resave: true,
  saveUninitialized: false,
  cookie: {
    sameSite: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000
  },
  store: new PrismaSessionStore(
    new PrismaClient(),
    {
      checkPeriod: 2 * 60 * 1000,  //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
}))


app.use(passport.initialize());
app.use(passport.session())

app.use('/auth', require('./auth'))

require('./api-routes')(app)

// Serve static data in app folder
app.use(express.static(path.join(root, 'client/dist'), {
  setHeaders: (res, path) => {
    // Custom Cache-Control for HTML files, let client cache assets resources for 1 day
    res.setHeader('Cache-Control', 'max-age=86400')
  }
}))

// Serve html client
app.get('*', (req, res) => {
  res.sendFile(path.join(root, '/client/dist/index.html'));
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening to requests on port ${port}`)
})

module.exports = app