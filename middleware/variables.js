const variables = (req, res, next) => {
    res.locals.isAuth = req.session.isAuthenticated;
    res.locals.csrf = req.csrfToken();

    next();
};

module.exports = variables;
