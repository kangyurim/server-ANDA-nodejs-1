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
    const {hospitalId, score, content} = req.body;

    if(!score)
        return res.send(response(baseResponse.REVIEW_SCORE_EMPTY));
    if(content.length < 10)
        return res.send(response(baseResponse.REVIEW_CONTENT_LENGTH));

    const postReviewResponse = await reviewService.createReview(
        req,
        hospitalId,
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

 }