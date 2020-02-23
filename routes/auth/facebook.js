const express = require(`express`),
    router = express.Router(),
    passport = require(`passport`);


router.get(`/`, passport.authenticate(`facebook`, {
    scope: [`email`],
    authType: `rerequest`,
    failureFlash: true,
    successFlash: true,
    failureRedirect: `/`,
    successRedirect: `/profile`
}));

router.get(`/redirect`, passport.authenticate(`facebook`, {
    failureFlash: true,
    successFlash: true,
    failureRedirect: `/`,
    successRedirect: `/profile`
}));


module.exports = router;