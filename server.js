if (process.env.NODE_ENV !== `production`) {
  require(`dotenv`).config();
}


const express = require(`express`);
const app = express();
const expressLayouts = require(`express-ejs-layouts`);
const methodOverride = require('method-override')
const session = require('express-session');
const MongoStore = require('connect-mongo');

const authRouter = require(`./routes/auth`);
const profileRouter = require(`./routes/profile`);
const postsRouter = require(`./routes/posts`);
const boardsRouter = require(`./routes/boards`);
const meditationRouter = require(`./routes/meditation`);

app.set(`view engine`, `ejs`);
app.set(`views`, __dirname + `/views`);
app.set(`layout`, `layouts/layout`);
app.use(expressLayouts);
app.use(express.static(`public`));
app.use(methodOverride('_method'))
app.use(express.urlencoded({ limit: `10mb`, extended: false }))

//Express session middleware
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/hackathon',
    }),
    secret: 'secretThatWillGoInENVWhenNotLazy',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 * 2, // two weeks
    },
  })
);

//auth reuqired middleware
const authRequired = function (req, res, next) {
  if(req.session.currentUser){
    return next();
  }
  return res.redirect("/");
}

//pull message board info
const {MessageBoard} = require('./models')
app.use(async function (req, res, next) {
  res.locals.user = req.session.currentUser;
  res.locals.boards = await MessageBoard.find({})
  next();
});

//auth required
const authRequired = function (req, res, next) {
  if(req.session.currentUser){
    return next();
  }
  return res.redirect("/");
}

const mongoose = require(`mongoose`);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on(`error`, (error) => console.error(error));
db.once(`open`, () => console.log(`Connection Established`));

app.use(`/`, authRouter);
app.use(`/profile`,authRequired, profileRouter);
app.use(`/posts`,authRequired, postsRouter);
app.use(`/boards`,authRequired, boardsRouter);
app.use(`/meditation`,authRequired, meditationRouter);

app.listen(process.env.PORT || 3000);
