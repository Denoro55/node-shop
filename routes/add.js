const {Router} = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.render('add', {
        title: 'Добавить курс',
        isAddCourse: true
    });
});

router.post('/', (req, res) => {
    console.log(req.body);
    res.send('запрос отправлен');
});

module.exports = router;
