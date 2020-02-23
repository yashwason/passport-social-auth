// Environment variables
require(`dotenv`).config({path: `process.env`});

// Requiring packages
const express = require(`express`),
    app = express(),
    passport = require(`passport`),
    helmet = require(`helmet`),
    morgan = require(`morgan`),
    bodyParser = require(`body-parser`),
    mongoose = require(`mongoose`),
    session = require(`express-session`),
    flash = require(`connect-flash`),
    MongoStore = require(`connect-mongo`)(session);


// DB setup
require(`./config/mongoose`);


// Setting security headers
app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard({ action: `sameorigin` }));
app.use(helmet.ieNoOpen());
app.use(helmet.hidePoweredBy({ setTo: 'PHP/7.1.31' })); // showing false value
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy({ policy: `no-referrer-when-downgrade` }));
app.use(helmet.xssFilter());


// Passport config
require(`./config/passport`);


// App setup
app.set(`view engine`, `ejs`);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + `/public`));
app.use(morgan(':method :url - :status - :response-time ms')); // logging http activity
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 20 * 60 // 20 seconds
    }),
    cookie: {maxAge: 20 * 1000} // 20 seconds
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// Routes
const routes = require(`./routes/_all`);
app.use(routes);


// Server setup
app.listen(process.env.PORT, () => { console.log(`Server listening on ${process.env.PORT}`); });