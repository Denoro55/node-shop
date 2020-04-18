const {Router} = require('express');
const router = Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const {validationResult} = require('express-validator/check');
const {courseValidator} = require('../utils/validators');

function isOwnerCourse(course, req) {
    return course.userId.toString() === req.user._id.toString();
}

router.get('/', async (req, res) => {
    // const courses = await Course.find().populate('userId', 'name').select('title');

    try {
        const courses = await Course.find();
        res.render('courses', {
            title: 'Курсы',
            name: 'courses',
            userId: req.user ? req.user._id : null,
            courses
        });
    } catch (e) {
        console.log(e)
    }
});

router.get('/add', auth, (req, res) => {
    res.render('course/add', {
        title: 'Добавить курс',
        name: 'add-course',
        data: {}
    });
});

router.post('/add', auth, courseValidator, async (req, res) => {
    const {title, price, img} = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('course/add', {
            title: 'Добавить курс',
            name: 'add-course',
            error: errors.array()[0].msg,
            data: {
                title, price, img
            }
        });
    }

    try {
        const course = new Course({title, price, img, userId: req.user});
        await course.save();
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        res.render('course/index', {
            layout: 'empty',
            course
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id/edit', auth, async (req, res) => {
    // if (!req.query.allow) {
    //     return res.redirect('/courses');
    // }

    try {
        const course = await Course.findById(req.params.id);
        if (!isOwnerCourse(course, req)) {
            return res.redirect('/courses');
        }

        res.render('course/edit', {
            course
        });
    } catch (e) {
        console.log(e);
    }
});

router.post('/edit', auth, courseValidator, async (req, res) => {
    const id = req.body.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/courses/${id}/edit`);
    }

    try {
        delete req.body.id;

        const course = await Course.findById(id);
        if (!isOwnerCourse(course, req)) {
            return res.redirect('/courses');
        }

        Object.assign(course, req.body);
        await course.save();

        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
});

router.post('/remove', auth, async (req, res) => {
    try {
        const id = req.body.id;
        await Course.deleteOne({
            _id: id,
            userId: req.user._id
        });
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
