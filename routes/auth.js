const {Router} = require('express');
const router = Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
   res.render('auth', {
       name: 'auth',
       error: req.flash('error')
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
            res.redirect('/auth#login');
        }
    } else {
        req.flash('error', 'Пользователя с таким email не существует');
        res.redirect('/auth#login');
    }
});

router.post('/register', async (req, res) => {
    const {name, email, password, repeat} = req.body;
    const isExists = await User.findOne({ email });
    if (isExists) {
        return res.redirect('/auth#register');
    } else {
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({name, email, password: hashPassword});
        await user.save();
        res.redirect('/auth#login');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/auth#login');
    });
});

module.exports = router;
