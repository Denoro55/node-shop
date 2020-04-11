const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const courseRoutes = require('./routes/courses');

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

// регистрация движка
app.engine('hbs', hbs.engine);
// установка движка
app.set('view engine', 'hbs');
// папка шаблонов
app.set('views', 'views');

app.use(express.static('public'));

app.use(express.urlencoded({extended: true}));
app.use('/', homeRoutes);
app.use('/courses', courseRoutes);

app.use((req, res, next) => {
    console.log('middleware');
    next();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('server is listening on port ', PORT)
});
