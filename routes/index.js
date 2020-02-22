const express = require(`express`),
    router = express.Router(),
    request = require(`request-promise`),
    { check, validationResult } = require(`express-validator`),
    { sendMail } = require(`../handlers/mail`),
    NewsletterSubscriber = require(`../models/newslettersubcriber`);

router.get(`/`, (req, res) => {
    res.render(`home`, {
        docTitle: `Welcome`
    })
});

router.get(`/contact`, (req, res) => {
    res.render(`contact`, {
        docTitle: `Get in Touch`,
        previousResponse: null // used in post route if captcha isn't entered by user
    });
});

router.post(`/contact`, (req, res) => {
    if(!req.body[`g-recaptcha-response`]){
        req.flash(`error`, `Please check the box in the form to prove you're not a bot!`);
        return res.redirect(`/contact`);
    }

    request({
        uri: `https://www.google.com/recaptcha/api/siteverify`,
        qs: {
            secret: process.env.RECAPTCHA_V2_SECRET,
            response: req.body[`g-recaptcha-response`]
        },
        method: `POST`,
        json: true
    })
    .then(async (response) => {
        if(response.success){
            try{
                await sendMail(
                    process.env.ADMIN_EMAIL,
                    `New Contact Form Submission on ${process.env.BASE_URL}`,
                    `<p>Name: ${req.body.name}</p>
                    <p>Email: ${req.body.email}</p>
                    <p>Mobile: ${req.body.mobile}</p>
                    <p>Message: ${req.body.message}</p>`
                );
                
                req.flash(`success`, `Your submission has been received by us!`);
            }
            catch(err){
                console.log(err);
                return req.flash(`error`, `We couldn't submit your message. Please try again.`)
            }
            finally{
                return res.redirect(`/contact`);
            }
        }
        throw `Couldn't verify captcha`;
    })
    .catch((err) => {
        console.log(err);
        req.flash(`error`, `We couldn't submit your query. Please try again, and make sure to complete the Captcha`);
        return res.redirect(`/contact`);
    });
});

router.post(`/newsletter`,
    check(`email`).isEmail().withMessage(`You entered an invalid e-mail`),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            let errMsgs = errors.array().map((error) => {
                return error.msg;
            });
            return res.json(errMsgs[0]);
        }
        return next();
    },
    (req, res) => {
        // Checking if subscriber exists already
        NewsletterSubscriber.find({email: req.body.email})
        .then((foundUser) => {
            if(foundUser.length > 0){
                return res.json(`Looks like you're already part of our newsletter!`);
            }
            else{
                NewsletterSubscriber.create({
                    email: req.body.email
                })
                .then((newUser) => {
                    res.json(`Welcome to the community! You're part of the newsletter now!`);
                })
                .catch((err) => {
                    res.json(`A backend error was observed while subscribing you! Please try again.`);
                });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.json(`A backend error was observed while subscribing you! Please try again.`);
        });
});


module.exports = router;