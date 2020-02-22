const express = require(`express`),
    router = express.Router(),
    csrf = require(`csurf`),
    passport = require(`passport`),
    authMiddleware = require(`../middleware/auth`),
    User = require(`../models/user`),
    { generateToken } = require(`../util/auth`),
    { sendMail } = require(`../handlers/mail`);

let csrfProtection = csrf();

// Login routes
router.get(`/login`,
    csrfProtection,
    authMiddleware.notLoggedIn,
    (req, res) => {
        res.render(`auth/login`, {
            docTitle: `Login to Your Account`,
            csrfToken: req.csrfToken()
        });
});

router.post(`/login`,
    csrfProtection,
    authMiddleware.notLoggedIn,
    authMiddleware.checkUserCredentials,
    authMiddleware.validateErrors,
    passport.authenticate(`local-signin`, {
       successRedirect: `/shop`,
       failureRedirect: `/login`,
       failureFlash: true,
       successFlash: true
}));


// Signup routes
router.get(`/register`,
    csrfProtection,
    authMiddleware.notLoggedIn,
    (req, res) => {
        res.render(`auth/register`, {
            docTitle: `Create Your Account`,
            csrfToken: req.csrfToken()
        });
});
router.post(`/register`,
    csrfProtection,
    authMiddleware.notLoggedIn,
    authMiddleware.checkUserCredentials,
    authMiddleware.validateErrors,
    passport.authenticate(`local-signup`, {
        failureRedirect: `/register`,
        successRedirect: `/login`, // not logging user in without verifying email
        failureFlash: true,
        successFlash: true
}));

// Logout route
router.get(`/logout`,
    authMiddleware.isLoggedIn,
    (req, res,) => {
        req.logout();
        req.flash(`success`, `Successfully logged out!`);
        res.redirect(`/login`);
});

// Account confirmation logic
router.get(`/confirm/account`,
    authMiddleware.notLoggedIn,
    (req, res) => {
        const token = req.query.token,
            email = req.query.email;

        User.findOneAndUpdate({
            email: email,
            token: token
        },{
            token: null,
            active: true
        }, {
            new: true
        })
        .then(async (user) => {
            req.login(user, (err) => {
                if(err){
                    throw `Error logging user in`;
                }
                req.flash(`success`, `Account activated! Welcome to the family!`);
                return res.redirect(`/shop`);
            });
        })
        .catch((err) => {
            console.log(`error activating account. ${err}`);

            res.redirect(`/login`);
            return req.flash(`error`, `Couldn't activate your account. Please try again`);
        })
});

// Password reset logic
router.post(`/forgot`,
    authMiddleware.notLoggedIn,
    (req, res) => {
        let email = req.body.forgot_email,
            confirmationToken = generateToken(50);

        User.findOneAndUpdate({
            email: email
        }, {
            token: confirmationToken
        }, {
            new: true
        })
        .then(async (user) => {
            if(user){
                await sendMail(email,
                    `POMP Account Password Reset`,
                    `Please follow this link to reset your POMP Account password`,
                    `${process.env.BASE_URL}/reset/password?token=${confirmationToken}&email=${email}`);

                req.flash(`success`, `Password reset link sent to ${email}`);
                return res.redirect(`/login`);
            }
            throw `Cannot find any account associated with this email`
        })
        .catch((err) => {
            req.flash(`error`, err);
            console.log(err);
            return res.redirect(`/login`);
        });
});

router.get(`/reset/password`,
    csrfProtection,
    authMiddleware.notLoggedIn,
    (req, res) => {
        let token = req.query.token,
            email = req.query.email;

        User.find({
            token: token,
            email: email
        })
        .then( async (users) => {
            if(users.length){
                req.flash(`success`, `Account verified! Reset password below`);
                return res.render(`auth/reset`, {
                    docTitle: `Password Reset`,
                    email: users[0].email,
                    token: token,
                    csrfToken: req.csrfToken()
                });
            }
        })
        .catch((err) => {
            req.flash(`error`, `Account couldn't be verified. Try again`);
            console.log(err);
            return res.redirect(`/login`);
        });
});

router.post(`/reset/password`,
    csrfProtection,
    authMiddleware.notLoggedIn,
    authMiddleware.checkUserCredentials,
    authMiddleware.validateErrors,
    (req, res) => {
        let token = req.body.token,
            email = req.body.email,
            password = req.body.password;

        User.findOne({
            email: email,
            token: token
        })
        .then(async (user) => {
            user.password = user.hashPassword(password);
            user.token = null;
            return await user.save();
        })
        .then(async (user) => {
            await sendMail(email,
                `POMP Account Password Reset`,
                `Your POMP account's password has been reset. If this wasn't you. Please email us regarding this issue, and provide us with your registered email address immediately.`);

            req.flash(`success`, `Password Successfully Reset!`);
            req.login(user, (err) => {
                if(err){
                    throw err;
                }
                res.redirect(`/shop`);
            });
        })
        .catch((err) => {
            req.flash(`error`, `Password Couldn't be Reset. Please try again`);
            console.log(err);
            res.redirect(`/login`);
        });
});


module.exports = router;