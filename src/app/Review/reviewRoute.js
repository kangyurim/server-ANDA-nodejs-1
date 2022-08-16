module.exports = function(app){
    const review = require('./reviewController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const {imageUploader} = require('./s3ImgUploader');


    //1. 리뷰 남기기
    app.post('/app/review/post', jwtMiddleware, imageUploader.any('images'), review.postReview);

}