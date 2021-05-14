if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const fetch = require('node-fetch');
const  getCountry  = require('./utils/getCountry');
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const passport = require('passport');
const localStrategy = require('passport-local');
const ExpressError = require('./utils/ExpressError');
const homeRouter = require('./routes/home');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');
const searchRouter = require('./routes/search');
const controlPanelRouter = require('./routes/controlpanel');
const User = require('./models/user');
const MongoDBStore = require('connect-mongo')(session);


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/goshaheen';
// database connection /////////////////////////////////////////////
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('database connected');
});
////////////////////////////////////////////////////////////////////
const secret = process.env.SECRET || 'goshaheen2021';
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})
store.on('error', (e)=>{
    console.log('session store error')
})
const sessionConfig = {
    store,
    secret,
    name: '_goshaheen',
    resave: false,
    saveUninitialized:true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(mongoSanitize({
    replaceWith: '_'
}))

app.use(flash());
app.use(session(sessionConfig));
app.use(methodOverride('_method'));
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net/"
];
const styleSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://cdn.jsdelivr.net/",
];
const fontSrcUrls = [
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com/"
];

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["https://www.youtube.com/"],
        connectSrc: ["'self'"],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'",  ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [
            "'self'",
            "blob:",
            "data:",
            "http://my-test-11.slatic.net/",
            "https://sg-test-11.slatic.net/",
            "https://images-na.ssl-images-amazon.com/"
        ],
        fontSrc: ["'self'", ...fontSrcUrls],
    }
})
);
//config passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// res.locals varibles available when page is rendered 
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next();
});

app.use(async (req, res, next)=>{
    const country = await getCountry();
    const getData = await fetch(`http://api.ipstack.com/${req.ip}?access_key=${process.env.IPSTACK_KEY}`);
    const result = await getData.json();
    res.locals.country = country;
    if(country !== 'Saudi Arabia' && country !== 'Malaysia'){
        next(new ExpressError(`'${country} / ${result.ip} / ${req.ip} not available`))
    }
    next();
})

// include routes 
app.use('/', homeRouter);
app.use('/product', productRouter);
app.use('/', userRouter);
app.use('/search', searchRouter);
app.use('/controlpanel', controlPanelRouter)



app.all('*', (req, res, next)=>{
    next(new ExpressError('Page not found', 404))
});

app.use((err, req, res, next)=>{
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'something went wrong';
    res.status(statusCode).render('error', { err, title: err.message })
})
// the port is be sitten by heroku if we are in development mode we will use 3000
const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log(`server listening to port ${port}`)
})