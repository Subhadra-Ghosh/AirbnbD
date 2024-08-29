const express= require("express");
const router= express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const multer  = require('multer')
const {storage} =require("../cloudConfig.js")  ;
const upload = multer({ storage })


const {isLoggedin, isOwner,validateListing} = require("../middleware.js")
const listingController = require("../controller/listing.js")

//new route
router.get("/new" ,isLoggedin,listingController.newForm
);

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedin,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createRoute
));




router.route("/:id")
.get(wrapAsync(listingController.showRoute))
.put(isLoggedin,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateRoute
))
.delete( isLoggedin, isOwner,wrapAsync(listingController.deleteRoute
));



//edit route
router.get("/:id/edit" ,isLoggedin, isOwner,wrapAsync(listingController.editRoute
));



module.exports= router;
//************************ */

// const express= require("express");
// const router= express.Router();
// const wrapAsync = require('../utils/wrapAsync.js');



// const {isLoggedin, isOwner,validateListing} = require("../middleware.js")
// const listingController = require("../controller/listing.js")


// //index route
// router.get("/" ,wrapAsync(listingController.index));

// //new route
// router.get("/new" ,isLoggedin,listingController.newForm
// );


// //show route
// router.get("/:id" ,wrapAsync(listingController.showRoute
// ));

// //create route
// router.post("/" ,isLoggedin,validateListing,wrapAsync(listingController.createRoute
// ));


// //edit route
// router.get("/:id/edit" ,isLoggedin, isOwner,wrapAsync(listingController.editRoute
// ));

// //update route
// router.put("/:id" ,isLoggedin,isOwner,validateListing,wrapAsync(listingController.updateRoute
// ));

// //delete route
// router.delete("/:id" , isLoggedin, isOwner,wrapAsync(listingController.deleteRoute
// ));


// module.exports= router;

