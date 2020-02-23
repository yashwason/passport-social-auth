const passport = require(`passport`),
    GoogleStrategy = require(`passport-google-oauth2`).Strategy,
    FacebookStrategy = require(`passport-facebook`),
    User = require(`../models/user`);

    
passport.serializeUser((user, done) => {
    done(null, user._id)
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


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH2_KEY,
    clientSecret: process.env.GOOGLE_OAUTH2_SECRET,
    callbackURL: '/auth/google/redirect'
}, async (accessToken, refreshToken, profile, done) => {
    // check if user already exists in our own db
    try{
        const currentUser = await User.findOne(
            {$or:[ 
                { googleid: profile.id },
                { email: profile.email } 
        ]});

        if(currentUser){
            // already have this user
            if(!currentUser.googleid){
                await User.findOneAndUpdate({email:currentUser.email}, {googleid:profile.id});
            }
            return done(null, currentUser, { message: `Welcome back ${currentUser.name}!` });
        }
        else{
            // if not, create user in our db
            const newUser = await new User({
                name: profile.displayName,
                email: profile.email,
                googleid: profile.id,
                active: profile.email_verified
            }).save();
            return done(null, newUser, { message: `Welcome to the family ${newUser.name}!` });
        }
    }
    catch(err){
        console.log(err);
        return done(err);
    }
}));


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    profileFields: [`id`, `displayName`,`email`],
    callbackURL: `/auth/facebook/redirect`
}, (async (accessToken, refreshToken, profile, done) => {
    // check if user already exists in our own db
    try{
        const currentUser = await User.findOne(
            {$or:[ 
                { facebookid: profile.id },
                { email: profile.emails[0].value } 
        ]});

        if(currentUser){
            // already have this user
            if(!currentUser.facebookid){
                await User.findOneAndUpdate({email:currentUser.email}, {facebookid:profile.id});
            }
            return done(null, currentUser, { message: `Welcome back ${currentUser.name}!` });
        }
        else{
            // if not, create user in our db
            const newUser = await new User({
                facebookid: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                active: true
            }).save();
            return done(null, newUser, { message: `Welcome to the family ${newUser.name}!` });
        }
    }
    catch(err){
        console.log(err);
        return done(err);
    }
})));