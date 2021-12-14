if (process.env.NODE_ENV !== `production`) {
  require(`dotenv`).config();
}

const express = require(`express`);
const app = express();
const expressLayouts = require(`express-ejs-layouts`);
const session = require('express-session');
const MongoStore = require('connect-mongo');

<<<<<<< HEAD
const indexRouter = require(`./routes/index`);
=======
const indexRouter = require(`./routes/index`)
const profileRouter = require(`./routes/profile`)
const postsRouter = require(`./routes/posts`)
const boardsRouter = require(`./routes/boards`)
>>>>>>> d6f5d99e0421bab14c13c4cf30f43a157222eca6

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

<<<<<<< HEAD
app.use(`/`, indexRouter);
=======
app.use(`/`, indexRouter)
app.use(`/profile`, profileRouter)
app.use(`/posts`, postsRouter)
app.use(`/boards`, boardsRouter)
>>>>>>> d6f5d99e0421bab14c13c4cf30f43a157222eca6

app.listen(process.env.PORT || 3000);
