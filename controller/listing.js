const listing= require("../models/listing");



module.exports.index= async (req,res)=>{
    let listings= await listing.find({});
    res.render("./listing/index.ejs" ,{listings});
};

module.exports.newForm=(req,res)=>{
   
    res.render("listing/newForm.ejs" );
};



module.exports.showRoute =async (req,res)=>{
    let {id}=req.params;
    let Listing = await listing.findById(id)
         .populate({
             path: "reviews",
             populate: {
                 path: "author",
             }
         })
         .populate("owner");
        
    if(!Listing){
       req.flash("error" ,"Listing you requested  for does not exit!");
       res.redirect("/listings");
    }
    res.render("./listing/show.ejs" ,{Listing});
}

module.exports.createRoute =async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new listing(req.body.listing);
    newListing.owner= req.user._id;
    newListing.image = {url ,filename};
    newListing.category = req.body.listing.category;

    console.log(newListing);
    
    console.log(newListing);
    await newListing.save();
    req.flash("success" ,"New listing created!");
    res.redirect("/listings");
    next();
}
module.exports.editRoute= async (req,res)=>{
    let {id}=req.params;
    let Listing=await listing.findById(id);
    if(!Listing){
        req.flash("error" ,"Listing you requested  for does not exit!");
        res.redirect("/listings");
     }
     let originalImageUrl = Listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_300");
      res.render("./listing/edit.ejs" ,{Listing, originalImageUrl});
}

module.exports.updateRoute= async (req,res)=>{
    let {id}=req.params;
    
   let Listing = await listing.findByIdAndUpdate(id, {...req.body.listing});
   if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    Listing.image ={url , filename};
    await Listing.save();
   }
    req.flash("success" ,"listing  updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteRoute =async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success" ," listing Deleted!");
    res.redirect(`/listings`);
}
//**************************************************** */



