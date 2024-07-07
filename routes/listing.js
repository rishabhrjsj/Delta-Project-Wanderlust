const express =require("express");
const router =express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



router.route("/")
.get(wrapAsync(listingController.index)) //show route
.post(upload.single('listing[image]'), validateListing,  wrapAsync(listingController.createListing));//create route

 //new route
 router.get("/new",isLoggedIn, listingController.newForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))//eidt route
.put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync (listingController.updateListing))//update route
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));//delete listing rourte

 //new route
 router.get("/new",isLoggedIn, listingController.newForm);
 
 //edit route
 router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));


 module.exports= router;