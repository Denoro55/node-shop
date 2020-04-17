const keys = require('../keys');

module.exports = function(to) {
    return {
        from: keys.EMAIL_FORM,
        to: 'denis.chertenko@mail.ru',
        subject: 'Аккаунт создан',
        html: `
            <h3>Поздравляем!</h3>
            <p>Вы зарегистрировались на сайте</p>
            <hr>
            <a href=${keys.BASE_URL}>Перейти на сайт</a>
        `
    }
};
