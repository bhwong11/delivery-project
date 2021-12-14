if (process.env.NODE_ENV !== `production`) {
  require(`dotenv`).config();
}

const express = require(`express`);
const app = express();
const expressLayouts = require(`express-ejs-layouts`);
const session = require('express-session');
const MongoStore = require('connect-mongo');

const indexRouter = require(`./routes/index`);

app.set(`view engine`, `ejs`);
app.set(`views`, __dirname + `/views`);
app.set(`layout`, `layouts/layout`);
app.use(expressLayouts);
app.use(express.static(`public`));

//Express session middleware
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/hackathon',
    }),
    secret: 'secretThatWillGoInENVWhenNotLazy',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 * 2, // two weeks
    },
  })
);

app.use(function (req, res, next) {
  res.locals.user = req.session.currentUser;
  next();
});

const mongoose = require(`mongoose`);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on(`error`, (error) => console.error(error));
db.once(`open`, () => console.log(`Connection Established`));

app.use(`/`, indexRouter);

app.listen(process.env.PORT || 3000);
