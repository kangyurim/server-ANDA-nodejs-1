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
    /*
        Body: userIdx, content, postImgUrls
    */
    const {hospitalId, userId, score, content, postImgUrls} = req.body;
    

    if(!score)
        return res.send(response(baseResponse.REVIEW_SCORE_EMPTY));
    if(content.length < 10)
        return res.send(response(baseResponse.REVIEW_CONTENT_LENGTH));
    /*if(postImgUrls.length <= 0)
        return res.send(response(baseResponse.POST_POSTIMGURLS_EMPTY));
    */

    const postReviewResponse = await reviewService.createReview(
        hospitalId,
        userId,
        score,
        content,
        postImgUrls
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