const Listing = require("../models/listing.js");


module.exports.index = async (req, res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
 };

 module.exports.newForm =  (req, res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing =  async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!listing){
       req.flash("error", "Listing you requested for does not exist!");
       res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing =  async (req, res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing")
    // }


    // const result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
    let url = req.file.path;
    let filename = req.file.filename;
   
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;//add owner to new listing
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req, res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing")
    // }
 
   console.log(req.file);
    let{id} = req.params;
    let listing =await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
    if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image ={url, filename};

    await listing.save();
    }
    req.flash("success", "listing Updated!");
    res.redirect(`/listings/${id}`);

};

module.exports.destroyListing = async (req, res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};