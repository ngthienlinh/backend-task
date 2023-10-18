
const passport = require('passport')

module.exports = (app) => {
  // Enforce authentication for all api routes
  app.all('/api/*', passport.authenticate('session'), (req, res, next) => {
    next()
  })

  app.use('/api/dashboard', require('./dashboard'))
}