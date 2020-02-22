const express =  require(`express`),
    router = express.Router();

router.get(`/privacy`, (req, res) => {
    res.render(`legal/privacy`, {
        docTitle: `Privacy Policy`
    });
});

router.get(`/disclaimer`, (req, res) => {
    res.render(`legal/disclaimer`, {
        docTitle: `Terms & Conditions`
    });
});

router.get(`/delivery`, (req, res) => {
    res.render(`legal/delivery`, {
        docTitle: `Delivery/Returns Policy`
    });
});

module.exports = router;