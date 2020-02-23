const express = require(`express`),
    router = express.Router(),
    securityMiddleware = require(`../middleware/security`);
   
router.use(securityMiddleware.escapeBodyHTML);


// Local variables
router.use((req, res, next) => {
    res.locals.errMsgs = req.flash(`error`);
    res.locals.successMsgs = req.flash(`success`);
    res.locals.isLoggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});

// Routes
const indexRoutes = require(`./index`),
    authRoutes = require(`./auth/_all`);

router.use(indexRoutes);
router.use(`/auth`, authRoutes);
router.use((req, res, next) => {
    return res.status(400).send(`404 - This Page Doesn't Exist`);
});


module.exports = router;