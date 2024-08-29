const listing = require("./models/listing.js");
const { listingSchema} = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const review = require("./models/review.js");





module.exports.isLoggedin = (req , res ,next)=>{
 
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl ;
        req.flash("error" , "you must be logged to create listing");
       return  res.redirect("/login");
     }
     next();
}


module.exports.saveRedirectUrl = (req , res ,next)=>{
   if(req.session.redirectUrl){
      res.locals.redirectUrl= req.session.redirectUrl;
   }
   next();
};

module.exports.isOwner = async (req , res ,next)=>{
   let {id} = req.params;
   let Listing = await listing.findById(id);
   if(!Listing.owner._id.equals(res.locals.currUser._id)) {
       req.flash("error" ,"you are not owner of this listing");
       return res.redirect(`/listings/${id}`);
   }
   next();
};

module.exports.validateListing = (req, res, next) => {
   const { error } = listingSchema.validate(req.body);
   if (error) {
       const errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg);
   } else {
       next();
   }
}

module.exports.validateReview = (req, res, next) => {
   const { error } = reviewSchema.validate(req.body);
   if (error) {
       const errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg);
   } else {
       next();
   }
}



module.exports.isReviewAuthor = async (req , res ,next)=>{
    let {id ,reviewId} = req.params;
    let Review = await review.findById(reviewId);
    if(!Review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error" ,"you did not create this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
 };
 
