const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const keys = require('./keys');

// const exphbs = require('express-handlebars');

// middleware
const variablesMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const homeRoutes = require('./routes/home');
const courseRoutes = require('./routes/courses');
const cardRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const mongoose = require('mongoose');

const app = express();

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
});

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

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}));
app.use(csrf());
app.use(flash());
app.use(variablesMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/courses', courseRoutes);
app.use('/cart', cardRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRoutes);

app.use((req, res, next) => {
    console.log('middleware');
    next();
});

const PORT = process.env.PORT || 3000;

async function connectToDb() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false
        });
        // const user = await User.findOne();
        // if (!user) {
        //     const newUser = new User({
        //         name: 'Den',
        //         email: 'denis.chertenko@mail.ru',
        //         cart: {
        //             items: []
        //         }
        //     });
        //     await newUser.save();
        // }
        app.listen(PORT, () => {
            console.log('server is listening on port ', PORT)
        });
    } catch (e) {
        console.log(e);
    }
}

connectToDb();
