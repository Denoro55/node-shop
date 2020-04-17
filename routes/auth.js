const {Router} = require('express');
const router = Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require("nodemailer");

const {user, pass} = require('../private');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {user, pass}
});

const regMail = require('../emails/register');
const resetMail = require('../emails/resetPassword');

router.get('/login', (req, res) => {
   res.render('auth/login', {
       name: 'auth',
       error: req.flash('error')
   });
});

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        name: 'auth',
        error: req.flash('error')
    });
});

router.get('/password/:token', async (req, res) => {
    const token = req.params.token;

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExp: {$gt: Date.now()}
        });

        if (user) {
            res.render('auth/password', {
                name: 'auth',
                userId: user._id,
                token,
                error: req.flash('error')
            });
        } else {
            res.redirect('/auth/login');
        }
    } catch (e) {
        console.log(e);
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/auth/login#login');
    });
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
        const isPasswordsEquals = await bcrypt.compare(password, candidate.password);
        if (isPasswordsEquals) {
            req.session.user = await User.findOne({ email });
            req.session.isAuthenticated = true;
            req.session.save((err) => {
                if (err) throw err;
                res.redirect('/');
            })
        } else {
            req.flash('error', 'Пароль неверный');
            res.redirect('/auth/login#login');
        }
    } else {
        res.redirect('/auth/login#login');
    }
});

router.post('/register', async (req, res) => {
    const {name, email, password, repeat} = req.body;
    const isExists = await User.findOne({ email });
    if (isExists) {
        req.flash('error', 'Пользователя с таким email не существует');
        return res.redirect('/auth/login#register');
    } else {
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({name, email, password: hashPassword});
        await user.save();
        res.redirect('/auth/login#login');
        await transporter.sendMail(regMail(), function (err, info) {
            if(err)
                console.log(err);
            else
                console.log(info);
        });
    }
});

router.post('/reset', (req, res) => {
    const {email} = req.body;

    crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
            req.flash('error', 'Что-то пошло не так. Попробуйте позже');
            return res.redirect('/auth/reset');
        }

        try {
            const candidate = await User.findOne({email});
            if (!candidate) {
                req.flash('error', 'Такого e-mail не существует');
                return res.redirect('/auth/reset');
            } else {
                const token = buffer.toString('hex');
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                await candidate.save();
                await transporter.sendMail(resetMail(candidate.email ,token));
                res.redirect('/auth/reset');
            }
        } catch (e) {
            console.log(e);
            req.flash('error', 'Что-то пошло не так. Попробуйте позже');
            return res.redirect('/auth/reset');
        }
    })
});

router.post('/password', async (req, res) => {
    const {userId, token, password} = req.body;
    try {
        const user = await User.findOne({
            _id: userId,
            resetToken: token,
            resetTokenExp: {$gt: Date.now()}
        });
        if (user) {
            user.password = await bcrypt.hash(password, 10);
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save();
            res.redirect('/auth/login#login');
        } else {
            req.flash('error', 'Время жизни токена истекло');
            res.redirect('/auth/login#login');
        }
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;

