// const User = require("../models/user.js");

// module.exports.renderSignUPForm=  (req,res)=>{
//     res.render("users/signup.ejs");
// }


// module.exports.userSignUp= async (req,res)=>{
//     try{
//         let {username,  email, password} = req.body;
//         const newUser= new User({username, email});
//         const registeruser= await User.register(newUser, password);
//         req.login(registeruser, (err)=>{
//             if(err){
//                 return next();
//             }
//             req.flash("success" ,"registered successfull!");
//             res.redirect("/listings");
//         })
       
//     }catch(e){
//         req.flash("error" , e.message);
//         res.redirect("/signup");
//     }
// }

// module.exports.renderLoginForm = (req, res)=>{
//     res.render("users/login.ejs");
// }

// module.exports.userLogin =  async (req, res)=>{
//     req.flash("success" ,"Welcome Back to WanderLust");
//     let redirectUrl= res.locals.redirectUrl || "/listings";
//     res.redirect(redirectUrl);
// }

// module.exports.userLogout = (req , res, next )=>{
//     req.logout((err)=>{
//       if(err){
//        return  next();
//       }
//       req.flash("success" , "you are logged out");
//       res.redirect("/listings");
//     })
 
  
//  }


const User = require("../models/user.js");

// Render Signup Form
module.exports.renderSignUPForm = (req, res) => {
    res.render("users/signup.ejs");
};

// Handle User Signup
module.exports.userSignUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Registered successfully!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Render Login Form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// Handle User Login
module.exports.userLogin = (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// Handle User Logout
module.exports.userLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out.");
        res.redirect("/listings");
    });
};
