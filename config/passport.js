const passport = require(`passport`),
    GoogleStrategy = require(`passport-google-oauth2`).Strategy,
    User = require(`../models/user`);

    
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


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH2_KEY,
    clientSecret: process.env.GOOGLE_OAUTH2_SECRET,
    callbackURL: '/auth/google/redirect'
}, async (accessToken, refreshToken, profile, done) => {
    // check if user already exists in our own db
    try{
        const currentUser = await User.findOne({google_id: profile.id});

        if(currentUser){
            // already have this user
            return done(null, currentUser, { message: `Welcome back ${currentUser.name}!` });
        }
        else{
            // if not, create user in our db
            const newUser = await User.create({
                google_id: profile.id,
                email: profile.email,
                name: profile.displayName,
                active: profile.email_verified
            }, { new: true });
            done(null, newUser, { message: `Welcome to the family ${newUser.name}!` });
        }
    }
    catch(err){
        console.log(err);
        return done(err);
    }
}));