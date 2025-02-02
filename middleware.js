const { model } = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/reviews");

const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn =(req, res, next)=>{ 

    if(!req.isAuthenticated()){
       // req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must logged in to create new listing");
    return res.redirect("/login");
   } next();

}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl; // Clear the stored redirect URL after use
    }
    next();
};


module.exports.isOwner = async (req, res, next)=>{
    let{id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not owner of this listing!");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next)=>{
    const {error} = listingSchema.validate(req.body);
    console.log(error);

    if(error){
        let errMSg = error.details.map((el)=>{el.message}).join(",");
        throw new ExpressError(400, errMSg);
    }else{
        next();
    }

};

module.exports.validateReview = (req, res, next)=>{
    const {error} = reviewSchema.validate(req.body);
    console.log(error);

    if(error){
        let errMSg = error.details.map((el)=>{el.message}).join(",");
        throw new ExpressError(400, errMSg);
    }else{
        next();
    }

};

module.exports.isReviewAuthor = async (req, res, next)=>{
    let{id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not author of this review!");
       return res.redirect(`/listings/${id}`);
    }
    next();
}