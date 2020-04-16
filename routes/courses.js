const {Router} = require('express');
const router = Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    // const courses = await Course.find().populate('userId', 'name').select('title');
    const courses = await Course.find();
    const c = new Course({
        title: 'Course',
        price: 1000
    });
    console.log(c.toClient());

    res.render('courses', {
        title: 'Курсы',
        name: 'courses',
        courses
    });
});

router.get('/add', auth, (req, res) => {
    res.render('course/add', {
        title: 'Добавить курс',
        name: 'add-course'
    });
});

router.post('/add', auth, async (req, res) => {
    const {title, price, img} = req.body;
    const course = new Course({title, price, img, userId: req.user});
    try {
        await course.save();
    } catch (e) {
        console.log(e);
    }
    res.redirect('/courses');
});

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);

    res.render('course/index', {
        layout: 'empty',
        course
    });
});

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/courses');
    }

    const course = await Course.findById(req.params.id);

    res.render('course/edit', {
        course
    });
});

router.post('/edit', auth, async (req, res) => {
    const id = req.body.id;
    delete req.body.id;
    await Course.findByIdAndUpdate(id, req.body);
    res.redirect('/courses');
});

router.post('/remove', auth, async (req, res) => {
    const id = req.body.id;
    await Course.deleteOne({_id: id});
    res.redirect('/courses');
});

module.exports = router;
