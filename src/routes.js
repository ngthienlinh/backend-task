
module.exports = (app) => {
    app.use('/dashboard', require('./dashboard'))

    // other routes should return a 404
    app.route('/*').get((req, res) => {
        res.sendStatus(404)
    })
}