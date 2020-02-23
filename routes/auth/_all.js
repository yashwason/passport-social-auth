const express = require(`express`),
    router = express.Router();

const googleAuthRoutes = require(`./google`),
    facebookAuthRoutes = require(`./facebook`);


router.use(`/google`, googleAuthRoutes);
router.use(`/facebook`, facebookAuthRoutes);
router.use(`/logout`, (req, res) => {
    req.logout();
    req.flash(`success`, `Successfully logged out!`);
    return res.redirect(`/`);
});

module.exports = router;