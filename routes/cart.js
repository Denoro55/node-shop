const {Router} = require('express');
const Course = require('../models/Course');
const router = Router();
const auth = require('../middleware/auth');

function computePrice(courses) {
    return courses.reduce((acc, c) => {
        return acc + c.price * c.count;
    }, 0);
}

function computeCourses(courses) {
    return courses.map(c => {
        return {
            count: c.count,
            ...c.courseId._doc,
            id: c.courseId.id
        }
    });
}

router.get('/', auth, async (req, res) => {
    const user = await req.user.populate('cart.items.courseId').execPopulate();
    const courses = computeCourses(user.cart.items);
    const totalPrice = computePrice(courses);

    res.render('cart', {
        name: 'cart',
        courses,
        totalPrice: totalPrice
    });
});

router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id);
    await req.user.addToCart(course);
    return res.redirect('/courses');
});

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id);
    const user = await req.user.populate('cart.items.courseId').execPopulate();
    const courses = computeCourses(user.cart.items);
    const totalPrice = computePrice(courses);
    const card = {
        courses,
        totalPrice
    };
    res.json(card);
});

module.exports = router;
