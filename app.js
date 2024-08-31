if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError.js');
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    try {
        await mongoose.connect(dbUrl,{
        //    useNewUrlParser: true,
        //     useUnifiedTopology: true
        serverSelectionTimeoutMS: 60000, // 30 seconds
         }
        );
        console.log("DB connected...");
    } catch (err) {
        console.error("DB connection error:", err);
    }
}

main();

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});
store.on("error", (err) => {
    console.log("Error in mongo session store:", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 5 * 24 * 60 * 60 * 1000,
        maxAge: 5 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log("Current User:", req.user); // Log the current user
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // Ensure this line is present
    next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("./listing/error.ejs", { message });
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080...");
});

//********************************************* */
// if(process.env.NODE_ENV !="production"){
//     require('dotenv').config();

// }

// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const methodOverride = require("method-override");
// const path = require("path");
// const ejsMate = require("ejs-mate");
// const ExpressError = require('./utils/ExpressError.js');
// const listingsRouter = require("./routes/listing.js");
// const reviewsRouter = require("./routes/review.js");
// const userRouter = require("./routes/user.js");

// const session= require("express-session");
// const MongoStore = require('connect-mongo');
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User= require("./models/user.js");


// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.engine("ejs", ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));

// const dbUrl = process.env.ATLASDB_URL;

// main().then(() => {
//     console.log("DB connected...");
// }).catch(err => console.log(err)); 


// async function main() {
//      await mongoose.connect(dbUrl);
   
// }

// const store = MongoStore.create({
//     mongoUrl : dbUrl,
//     crypto: {
//         secret:"mysupersecretcode"
//     },                    
//      touchAfter:    24 * 3600,
//     });
//  store.on("error" ,()=>{
//     console.log("error in mongo session store");
//  })

// const sessionOptions= {
//     store,
//     secret :"mysupersecretcode",
//     resave: false,
//     saveUninitialized: true,
//     cookie:{
//         expires:Date.now()+  5*24*60*60*1000,
//         maxAge : 5*24*60*60*1000,
//         httpOnly:true
//     }
// };


  

// //authentication of user
// app.use(session(sessionOptions));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


// // app.use((req, res ,next)=> {
// //     res.locals.success= req.flash("success");
// //     res.locals.error= req.flash("error");
// //     res.locals.currUser= req.User;
// //     next();
// // });

// // app.use((req, res, next) => {
// //     console.log("Current User:", req.user); // Log the current user
// //     res.locals.success = req.flash("success");
// //     res.locals.error = req.flash("error");
// //     res.locals.currUser = req.user;
// //     next();
// // });

// app.use((req, res, next) => {
//     console.log("Current User:", req.user); // Log the current user
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     res.locals.currUser = req.user; // Ensure this line is present
//     next();
// });

// app.use("/listings" ,listingsRouter);
// app.use("/listings/:id/reviews" ,reviewsRouter);
// app.use("/" ,userRouter);


// // app.get("/demouser"  ,async (req, res)=>{
// //      let fakeuser = new User({
// //            email: "@shiuyddhiugmail.com",
// //            username: "subhadra ghosh"
// //      });
// //     let registeruser = await User.register(fakeuser , "ghosh");
// //     res.send(registeruser);
// // })


// app.all('*' , (res, req, next) => {
//     next(new ExpressError(404, "page not found"));
// })

// app.use((err , req , res , next)=>{
//      let {statusCode=500,message="Something went wrong"}=err; 
//      res.status(statusCode).render("./listing/error.ejs" ,{message});
// });

// // app.get("/", async (req,res)=>{
// //     let sampleListing=new listing({
// //         title:"my new villa",
// //         description:"by the beatch",
// //         price:1200,
// //         location:"Goa",
// //         country:"india"

// //     });
// //     console.log(sampleListing);
// //    await  sampleListing.save();
// //     res.send("added ");
// // });
 
//  app.listen(8080,()=>{
//     console.log("server is listening 8080 port...");
//  });
// //%%%%%%%%%%%%%%%%%

//8888888888888888888888888888888888888888888888888888888888888888888

// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }

// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const methodOverride = require("method-override");
// const path = require("path");
// const ejsMate = require("ejs-mate");
// const ExpressError = require('./utils/ExpressError.js');
// const listingsRouter = require("./routes/listing.js");
// const reviewsRouter = require("./routes/review.js");
// const userRouter = require("./routes/user.js");

// const session = require("express-session");
// const MongoStore = require('connect-mongo');
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.engine("ejs", ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));

// const dbUrl = process.env.ATLASDB_URL;

// async function main() {
//     await mongoose.connect(dbUrl);
//     console.log("DB connected...");
// }

// main().catch(err => console.log(err));

// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     crypto: {
//         secret: "mysupersecretcode"
//     },
//     touchAfter: 24 * 3600,
// });
// store.on("error", () => {
//     console.log("error in mongo session store");
// })

// const sessionOptions = {
//     store,
//     secret: "mysupersecretcode",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         expires: Date.now() + 5 * 24 * 60 * 60 * 1000,
//         maxAge: 5 * 24 * 60 * 60 * 1000,
//         httpOnly: true
//     }
// };

// // Authentication middleware
// app.use(session(sessionOptions));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//     console.log("Current User:", req.user); // Log the current user
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     res.locals.currUser = req.user;
//     next();
// });

// app.use("/listings", listingsRouter);
// app.use("/listings/:id/reviews", reviewsRouter);
// app.use("/", userRouter);

// app.all('*', (req, res, next) => {
//     next(new ExpressError(404, "page not found"));
// })

// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "Something went wrong" } = err;
//     res.status(statusCode).render("./listing/error.ejs", { message });
// });

// app.listen(8080, () => {
//     console.log("server is listening on port 8080...");
// });
