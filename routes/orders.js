const {Router} = require('express');
const router = Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    const orders = await Order.find({'user.userId': req.user}).populate('user.userId');

    res.render('orders', {
        title: 'Заказы',
        name: 'orders',
        orders: orders.map(o => {
            console.log(o);
            return {
                ...o._doc,
                totalPrice: o.courses.reduce((acc, c) => acc + c.course.price * c.count, 0)
            };
        })
    });
});

router.post('/make', auth, async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.courseId').execPopulate();
        const courses = user.cart.items.map(c => {
            return {
                count: c.count,
                course: {...c.courseId._doc}
            }
        });

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses
        });

        await order.save();
        await user.clearCart();

        res.redirect('/orders');
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
