const {Router} = require('express');
const Card = require('../models/Card');
const Course = require('../models/Course');
const router = Router();

router.get('/', async (req, res) => {
    const card = await Card.fetchAll();

    res.render('card', {
        isCard: true,
        courses: card.courses,
        totalPrice: card.totalPrice
    })
});

router.post('/add', async (req, res) => {
    const course = await Course.getById(req.body.id);
    await Card.add(course);
    return res.redirect('/courses');
});

router.delete('/remove/:id', async (req, res) => {
    const card = await Card.removeById(req.params.id);
    res.json(card);
});

module.exports = router;
