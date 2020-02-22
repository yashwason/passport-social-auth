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
    res.locals.cartSession = req.session.cart;
    next();
});

// Routes
const indexRoutes = require(`./index`),
    authRoutes = require(`./auth`),
    legalRoutes = require(`./legal`);

router.use(indexRoutes);
router.use(authRoutes);
router.use(`/legal`, legalRoutes);
router.use((req, res, next) => {
    res.status(400).render(`error`, {
        docTitle: "Page Not Found"
    });
});

module.exports = router;