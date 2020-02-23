const express = require(`express`),
    router = express.Router();

const googleAuthRoutes = require(`./google`);


router.use(`/google`, googleAuthRoutes);
router.use(`/logout`, (req, res) => {
    req.logout();
    req.flash(`success`, `Successfully logged out!`);
    return res.redirect(`/`);
});

module.exports = router;