module.exports = function(app){
    const review = require('./reviewController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const {imageUploader} = require('./s3ImgUploader');

    //1. 리뷰 남기기
    app.post('/app/review/post/', jwtMiddleware, imageUploader.any('images'), review.postReview);

    //2. 병원 리뷰 보기
    app.get('/app/hospital/view', review.getReview);

    //3. 병원 title
    // app.get('app/hospital/hosinfo', review.hospitalInfo);

    //4. 라식 리뷰 별점 Top 9 가져오기
    app.get('/app/review/lasik/top9', review.getLasikTop9);

}