const auth = require('./auth/auth.service')

module.exports = (app) => {
  // Enforce authentication for all api routes
  app.all('/api/*', auth.isAuthenticated())

  app.use('/api/user', require('./user'))
  app.use('/api/dashboard', require('./dashboard'))
}