const reviews = require('../Models/reviews');
const asyncHandler = require('express-async-handler');
const apiError = require('../Utils/apiError');



exports.reviews = asyncHandler(async (req, res) => {
    const snapshot = await reviews.get()
    const reviewData = snapshot.docs.map(doc => doc.data());

    const data = {
        reviews : reviewData.length,
        minimumReviewCount: reviewData.filter(review => review.Rate <= 1.5).length,
        midReviewCount: reviewData.filter(review => review.Rate > 1.5 && review.Rate <= 3.5).length,
        maximumReviewCount: reviewData.filter(review => review.Rate > 3.5).length,
    }
    res.status(200).json(data);
})





