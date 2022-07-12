module.exports = function(app){
    const review = require('./reviewController');

    //1. 리뷰 남기기
    app.post('app/hospital/review', review.postReview);
}