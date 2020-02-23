const express = require(`express`),
    router = express.Router(),
    authMiddleware = require(`../middleware/auth`);



router.get(`/`,
authMiddleware.notLoggedIn,
(req, res) => {
    res.render(`home`, {
        docTitle: `Home`
    });
});


// User profile routes
router.get(`/profile`,
authMiddleware.isLoggedIn,
(req, res) => {
    res.render(`profile`, {
        docTitle: `${req.user.name}'s Profile`
    });
});


module.exports = router;