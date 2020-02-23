const express = require(`express`),
    router = express.Router(),
    passport = require(`passport`);

router.get(`/`, passport.authenticate(`google`, {
    scope: [`profile`, `email`],
    failureFlash: true,
    successFlash: true,
    failureRedirect: `/`
}));

router.get(`/redirect`,
passport.authenticate(`google`, {
    failureFlash: true,
    successFlash: true,
    failureRedirect: `/`,
    successRedirect: `/profile`
}));


module.exports = router;