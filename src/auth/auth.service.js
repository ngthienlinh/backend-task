'use strict'

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