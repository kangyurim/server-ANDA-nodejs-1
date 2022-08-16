module.exports = function(app){
    const review = require('./reviewController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    //1. 리뷰 남기기
    app.post('/app/review/post', review.postReview);

    //2. 병원 리뷰 보기
    app.get('/app/hospital/view', review.getReview);

    //3. 병원 title
    // app.get('app/hospital/hosinfo', review.hospitalInfo);
}