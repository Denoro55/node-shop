const {Router} = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Главная',
        name: 'index'
    });
});

module.exports = router;
