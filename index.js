const express = require('express');
const path = require('path');
// const exphbs = require('express-handlebars');

const homeRoutes = require('./routes/home');
const courseRoutes = require('./routes/courses');
const cardRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();

// const hbs = exphbs.create({
//     defaultLayout: 'main',
//     extname: 'hbs'
// });

// регистрация движка
// app.engine('hbs', hbs.engine);
// установка движка
app.set('view engine', 'pug');
// папка шаблонов
app.set('views', 'views');

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5e936388008e7b1b789f3c95');

        if (user) {
            req.user = user;
        }
        next();
    } catch (e) {
        console.log(e)
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: true}));
app.use('/', homeRoutes);
app.use('/courses', courseRoutes);
app.use('/cart', cardRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    console.log('middleware');
    next();
});

const PORT = process.env.PORT || 3000;

async function connectToDb() {
    const password = 'MELCWnjndlxWxV0Y';
    const url = `mongodb+srv://Denis:${password}@denis-ikstw.mongodb.net/shop`;
    try {
        await mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false});
        const user = await User.findOne();
        if (!user) {
            const newUser = new User({
                name: 'Den',
                email: 'denis.chertenko@mail.ru',
                cart: {
                    items: []
                }
            });
            await newUser.save();
        }
        app.listen(PORT, () => {
            console.log('server is listening on port ', PORT)
        });
    } catch (e) {
        console.log(e);
    }
}

connectToDb();
