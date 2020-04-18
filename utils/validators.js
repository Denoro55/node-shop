const {body} = require('express-validator/check');
const User = require('../models/User');

exports.registerValidators = [
    body('email')
        .isEmail().withMessage('Введите корректный email')
        .custom(async (value, {req}) => {
            try {
                const isExists = await User.findOne({ email: value });
                if (isExists) {
                    return Promise.reject('Такой email уже существует');
                }
            } catch (e) {
                console.log(e)
            }
        }),
    body('password', 'Пароль должен быть не менее 3 символов')
        .isLength({min: 3, max: 10})
        .isAlphanumeric()
        .trim(),
    body('confirm', )
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Пароли не совпадают');
            }
            return true;
        })
        .trim(),
    body('name', 'Имя должно быть не менее 3 символов')
        .isLength({min: 3})
        .trim()
];

exports.courseValidator = [
    body('title').isLength({min: 3}).withMessage('Длина названия должна быть не менее 3 символов'),
    body('price').isNumeric().withMessage('Введите корректную цену'),
    body('img', 'Введите корректный URL').isURL()
];
