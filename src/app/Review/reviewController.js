const reviewService = require("./reviewService");
const reviewProvider = require("./reviewProvider");

const {response} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");


/**
 * 1. 리뷰작성 API
 * @param {json} req 
 * @param {json} res 
 */
exports.postReview = async function(req, res){
    const token = req.verifiedToken;
    const {hospitalId, reviewType, score, content, expenseAmount} = req.body;
    
    if(!score) 
        return res.send(response(baseResponse.REVIEW_SCORE_EMPTY));
    const scoreToJson = JSON.parse(score);

    if(!token)
        return res.send(response.response(baseResponse.TOKEN_EMPTY));
    if(typeof(scoreToJson) != 'object') 
        return res.send(response(baseResponse.REVIEW_SCORE_TYPE_ERROR));
    if(!reviewType)
        return res.send(response(baseResponse.REVIEW_TYPE_EMPTY));
    if(content.length < 20)
        return res.send(response(baseResponse.REVIEW_CONTENT_LENGTH));
    if(reviewType != 'normal' && reviewType != 'lasic' && reviewType != 'lasec' && reviewType != 'smile-lasic' && reviewType != 'lens-insert' && reviewType != 'cataract') 
        return res.send(response(baseResponse.REVIEW_TYPE_INVALIED));
    if(!expenseAmount)
        return res.send(response(baseResponse.REVIEW_EXPENSEAMOUNT_EMPTY));
    
    const postReviewResponse = await reviewService.createReview(
        req,
        hospitalId,
        reviewType,
        scoreToJson,
        content,
        expenseAmount,
        token
    );

    return res.send(postReviewResponse);
}

/**
 * 2. 리뷰 간단 조회 API
 * @param {json} req 
 * @param {json} res 
 */
 exports.getReviewSimple = async function(req, res){
    /*
        Body: ophthalmologyId
    */

    const {ophthalmologyId} = req.body;
    // validation
    if(!ophthalmologyId) {
        return res.send(response(baseResponse.REVIEW_OPHTHALMOLOHYID_EMPTY));
    }
    if (ophthalmologyId <= 0) {
        return res.send(response(baseResponse.REVIEW_OPHTHALMOLOHYID_LENGTH));
    }
    if (typeof(ophthalmologyId) != 'number'){
        return res.send(response(baseResponse.REVIEW_OPHTHALMOLOHYID_TYPE_ERROR));
    }

    const reviewListResult = await reviewProvider.retrieveReviewListSimple(ophthalmologyId);

    return res.send(response(baseResponse.SUCCESS, reviewListResult));
 }

 /**
  * 분야별 top 9 병원 가져오기
  * @param {*} req 
  * @param {*} res 
  * @returns 
  */
 exports.getTop9 = async function(req, res){
    const location = req.body.location;
    const category = req.body.category;

    if(!location) return res.send(response(baseResponse.REVIEW_LOCATION_EMPTY));
    if(typeof(location) != 'object') return res.send(response(baseResponse.REVIEW_LOCATION_INVALIED));
    if(!category) return res.send(response(baseResponse.REVIEW_CATEGORY_EMPTY));
    if(category != 'lasic' && category != 'lasec' && category != 'smile-lasic' && category != 'lens-insert' && category != 'cataract' && category != 'diagnosis') return res.send(response(baseResponse.REVIEW_CATEGORY_INVALIED));
    const top9Review = await reviewProvider.retrieveTop9(location, category);

    return res.send(response(baseResponse.SUCCESS, top9Review));
 }

 /**
  * 지역을 기준으로 병원 리뷰 가져오기
  * @param {*} req 
  * @param {*} res 
  * @returns 
  */
 exports.getReviewArea = async function(req, res){
    const location = req.body.location;
    if(!location) return res.send(response(baseResponse.REVIEW_LOCATION_EMPTY));
    if(typeof(location) != 'object') return res.send(response(baseResponse.REVIEW_LOCATION_INVALIED));

    const getReviewArea = await reviewProvider.getReviewArea(location);

    return res.send(response(baseResponse.SUCCESS, getReviewArea));
 }

 exports.getDetatilReview = async function(req, res){
    const reqBody = req.body;

    if(!reqBody.reviewId) return res.send(response(baseResponse.REVIEW_REVIEWID_EMPTY));
    if(!reqBody.reviewType) return res.send(response(baseResponse.REVIEW_TYPE_EMPTY));

    const datailReviewRes = await reviewProvider.getDetailReview(reqBody.reviewType, reqBody.reviewId);

    return res.send(response(baseResponse.SUCCESS, datailReviewRes));

 }