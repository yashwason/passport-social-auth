const {check, validationResult} = require(`express-validator`);


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

exports.checkUserCredentials = [
    check(`email`).isEmail().withMessage(`You entered an invalid e-mail`),

    check(`password`)
    .isLength({min: 7}).withMessage(`Password must be more than 6 characters long`)
    .isAlphanumeric().withMessage(`Password must be a combination of alphabets and numbers`)
];

exports.validateErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        let errMsgs = errors.array().map((error) => {
            return error.msg;
        });
        req.flash(`error`, errMsgs);
        return res.redirect(req.originalUrl);
    }
    return next();
};