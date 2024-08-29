const express= require("express");
const router= express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const review = require("../models/review.js");
const {validateReview,isLoggedin,isReviewAuthor} = require("../middleware.js")
const listing = require("../models/listing.js");
const reviewController = require("../controller/review.js")






//reviews
//post review route
router.post("/" ,isLoggedin,wrapAsync(reviewController.reviewCreate
));

//Delete review route
router.delete("/:reviewId", isReviewAuthor,wrapAsync(reviewController.deleteReview
));


module.exports= router;