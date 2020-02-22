exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) return next();

    req.flash(`error`, `You need to be logged in for that!`);
    res.redirect(`back`);
};

exports.notLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) return next();

    req.flash(`error`, `Cannot go there when logged in!`);
    return res.redirect(`back`);
};

exports.isAdmin = (req, res, next) => {
    if(req.isAuthenticated() && req.user.admin){
        return next();
    }

    res.redirect(`/shop`);
};