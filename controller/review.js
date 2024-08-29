const listing= require("../models/listing");
const review = require("../models/review.js");


module.exports.reviewCreate =async (req,res)=>{
    let Listing = await listing.findById(req.params.id);
    let newReview =new review(req.body.review)
    newReview.author= req.user._id;
    Listing.reviews.push( newReview);
    await Listing.save();
    await newReview.save();
    req.flash("success" ,"New review created!");
    res.redirect(`/listings/${Listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash("success" ,"review deleted!");
    res.redirect(`/listings/${id}`);
}