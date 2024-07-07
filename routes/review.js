const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { reviewSchema } = require("../schema.js");
const reviewController = require("../controllers/reviews.js");
// Middleware to validate review
const validateReview = (req, res, next) => {
    const { rating, comment } = req.body.review;
    const ratingNumber = parseInt(rating, 10);
    if (!Number.isInteger(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
        throw new Error("Review rating must be a number between 1 and 5");
    }
    if (!comment) {
        throw new Error("Review comment is required");
    }
    req.body.review.rating = ratingNumber; // Ensure rating is a number
    next();
};

// Post route for creating a review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete route for a review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
