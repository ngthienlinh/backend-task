const express = require("express")
const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const path = require('path')
const app = express()
require('dotenv').config()

const root = path.normalize(__dirname + '/..')

// Basic secure for server
app.use(helmet())

// Compress response bodies
app.use(compression())

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
  allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization,,Access-Control-Request-Headers,x-http-method-override,Accept-Ranges",
  exposedHeaders: "Content-Disposition",
  maxAge: 1800,
  preflightContinue: false,
  credentials: true
}))

app.use(session({
  secret: process.env.SESSION_SECRET || '5pring',
  resave: true,
  saveUninitialized: false,
  cookie: { secure: true },
  store: new PrismaSessionStore(
    new PrismaClient(),
    {
      checkPeriod: 2 * 60 * 1000,  //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
}))

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