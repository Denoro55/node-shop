const keys = require('../keys');

module.exports = function(to, token) {
    return {
        from: keys.EMAIL_FORM,
        to: to,
        subject: 'Забыли пароль?',
        html: `
            <h3>Вы забыли пароль?</h3>
            <p>Если нет, то проигнорируйте данное сообщение</p>
            <p>Иначе перейдите по ссылке ниже</p>
            <a href=${keys.BASE_URL}/auth/password/${token}>Восстановить пароль</a>
            <hr>
            <a href=${keys.BASE_URL}>Перейти на сайт</a>
        `
    }
};
