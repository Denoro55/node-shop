const {Router} = require('express');
const router = Router();
const Course = require('../models/Course');

router.get('/', async (req, res) => {
    const courses = await Course.getAll();

    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    });
});

router.get('/add', (req, res) => {
    res.render('course/add', {
        title: 'Добавить курс',
        isAddCourse: true
    });
});

router.post('/add', async (req, res) => {
    const {title, price, url} = req.body;
    const course = new Course(title, price, url);
    await course.save();
    res.redirect('/courses');
});

router.get('/:id', async (req, res) => {
    const course = await Course.getById(req.params.id);

    res.render('course/index', {
        layout: 'empty',
        course
    });
});

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/courses');
    }
    const course = await Course.getById(req.params.id);

    res.render('course/edit', {
        course
    });
});

router.post('/edit', async (req, res) => {
    await Course.update(req.body);
    res.redirect('/courses');
});

module.exports = router;
