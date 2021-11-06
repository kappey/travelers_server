const indexRouter = require("./index");
const travelerRouter = require("./travelers");
const userRouter = require("./users");
const postRouter = require("./posts");
const statusRouter = require("./statuses");
const messengerRouter = require("./messenger");
const imageRouter = require("./images");

exports.corsAccessControl = (app) => {
  app.all('*', (req, res, next) => {
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,auth-token');
    next();
  });
}

exports.routesInit = (app) => {
  app.use("/", indexRouter);
  app.use("/travelers", travelerRouter);
  app.use("/users", userRouter);
  app.use("/posts", postRouter);
  app.use("/statuses", statusRouter);
  app.use("/messenger", messengerRouter);
  app.use("/images", imageRouter);

  app.use((req, res) => {
    res.status(404).json({ msg: "404 page not found" })
  })
}