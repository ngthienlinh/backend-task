const { body, oneOf, validationResult } = require('express-validator');
const errorHandler = require('./error-handler')

exports.validateNewUser = () => [
    body('name').trim().notEmpty().withMessage('Name is required.').isAlpha("en-US", { ignore: " '&" }).withMessage('Name must be alphabets.'),
    body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 8, max: 20 }).custom(value => {
        let res = /(?=^.{8,20}$)((?=.*\d)(?=.*[A-Za-z])(?=.*[A-Za-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*/
        return value && res.test(value)
    }).withMessage('Password must be 8-20 characters with at least one number and one alphabet.'),
    body('userId').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    errorHandler
]
