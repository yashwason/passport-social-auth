exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) return next();

    req.flash(`error`, `You need to be logged in for that!`);
    res.redirect(`/`);
};

exports.notLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) return next();

    req.flash(`error`, `Cannot go there when logged in!`);
    return res.redirect(`/profile`);
};