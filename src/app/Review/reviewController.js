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
    if(!token)
        return res.send(response.response(baseResponse.TOKEN_EMPTY))
    const {hospitalId, reviewType, score, content} = req.body;

    if(!score)
        return res.send(response(baseResponse.REVIEW_SCORE_EMPTY));
    if(!reviewType)
        return res.send(response(baseResponse.REVIEW_TYPE_EMPTY));
    if(content.length < 10)
        return res.send(response(baseResponse.REVIEW_CONTENT_LENGTH));

    if(reviewType != 'normal' && reviewType != 'lasic' && reviewType != 'lasec' && reviewType != 'smile-lasic' && reviewType != 'lens-insert') return res.send(response(baseResponse.REVIEW_TYPE_INVALIED));

    const postReviewResponse = await reviewService.createReview(
        req,
        hospitalId,
        reviewType,
        score,
        content,
        token
    );

    return res.send(postReviewResponse);
}

/**
 * 2. 리뷰조회 API
 * @param {json} req 
 * @param {json} res 
 */
 exports.getReview = async function(req, res){
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
    
        const reviewListResult = await reviewProvider.retrieveReviewLists(ophthalmologyId);
    
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