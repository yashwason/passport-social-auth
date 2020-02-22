const passport = require(`passport`),
    LocalStrategy = require(`passport-local`).Strategy,
    User = require(`../models/user`),
    { generateToken } = require(`../util/auth`),
    { sendMail } = require(`../handlers/mail`);


passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then((user) => {
        done(null, user);
    })
    .catch((err) => {
        console.log(`Error deserializing user: ${err}`);
        done(err);
    });
});

const strategyOptions = {
    usernameField: `email`,
    passwordField: `password`,
    passReqToCallback: true
};

passport.use(`local-signup`,
    new LocalStrategy(strategyOptions,
    (req, email, password, done) => {
        User.findOne({email: email})
        .then(async (user) => {
            if(user){
                return done(null, false, {message: `E-mail already in use!`});
            }

            if(req.body.password != req.body.re_password){
                return done(null, false, {message: `Passwords do not match!`});
            }

            let confirmationToken = generateToken(50);
            let newUser = new User();

            newUser.email = email;
            newUser.password = newUser.hashPassword(password);
            newUser.name = req.body.name;
            newUser.contact = req.body.contact;
            newUser.admin = req.body.email === process.env.ADMIN_EMAIL ? 1 : 0;
            newUser.active = 0;
            newUser.token = confirmationToken;

            await sendMail(newUser.email,
                    `POMP Account Verification`,
                    `Please click this link to verify your new POMP account!`,
                    `${process.env.BASE_URL}/confirm/account?token=${confirmationToken}&email=${newUser.email}`);

            return await newUser.save();
        })
        .then((newUser) => {
            if(newUser){
                // not serialising user into session before he's verified
                done(null, false, {message: `Account created! Check your email to verify account!`});
            }
        })
        .catch((err) => {
            console.log(`Error creating user. ${err}`);
            return done(err);
        });
}));

passport.use(`local-signin`,
    new LocalStrategy(strategyOptions,
    (req, email, password, done) => {
        User.findOne({email: email})
        .then((user) => {
            if(!user) return done(null, false, {message: `You do not have an POMP account yet! Sign up with us now!`});

            if(!user.active) return done(null, false, `You're account isn't verified. Please check email to verify`);

            if(!user.verifyPassword(password)) return done(null, false, `You entered an incorrect password`);

            return done(null, user, {message: `Welcome! Glad to have you back ${user.name}!`});
        })
        .catch((err) => {
            console.log(`Error logging in user. ${err}`);
        });
}));