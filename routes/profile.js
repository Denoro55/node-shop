const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/', auth, (req, res) => {
    res.render('profile', {
        name: 'profile',
        user: req.user.toObject()
    })
});

router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const toChange = {
            name: req.body.name
        };

        if (req.file) {
            toChange.avatarUrl = req.file.path;
        }

        Object.assign(user, toChange);
        await user.save();
        res.redirect('/profile');
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;
