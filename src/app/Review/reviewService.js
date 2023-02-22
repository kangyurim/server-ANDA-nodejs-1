const {pool} = require("../../../config/database");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const reviewDao = require("./reviewDao");
const reviewProvider = require("./reviewProvider");

/**
 * 1. 병원 리뷰 남기기
 * @param {*} hospitalId 
 * @param {*} userId 
 * @param {*} score 
 * @param {*} content 
 * @returns 
 */
exports.createReview = async function(req, hospitalId, reviewType, scoreToJson, content, expenseAmount, token) {
    const connection = await pool.getConnection(async (conn) => conn);
    let reviewResult;
    try {
        let insertReviewParams = new Object();
        let categoryScore = new Object();

        let s3Urls = new Array()
        for(var i in req.files)
        {
            s3Urls.push(req.files[i].location)
        }

        if(scoreToJson.friendlyScore == undefined) categoryScore.friendlyScore = 1;
        else categoryScore.friendlyScore = scoreToJson.friendlyScore;

        if(scoreToJson.waitScore == undefined) categoryScore.waitScore = 1;
        else categoryScore.waitScore = scoreToJson.waitScore;

        if(scoreToJson.priceScore == undefined) categoryScore.priceScore = 1;
        else categoryScore.priceScore = scoreToJson.priceScore;

        if(scoreToJson.infoScore == undefined) categoryScore.infoScore = 1;
        else categoryScore.infoScore = scoreToJson.infoScore;

        if(scoreToJson.recommendScore == undefined) categoryScore.recommendScore = 1;
        else categoryScore.recommendScore = scoreToJson.recommendScore;

        insertReviewParams.hospitalId = hospitalId;
        insertReviewParams.content = content;
        
        insertReviewParams.friendlyScore = categoryScore.friendlyScore;
        insertReviewParams.waitScore = categoryScore.waitScore;
        insertReviewParams.priceScore = categoryScore.priceScore;
        insertReviewParams.infoScore = categoryScore.infoScore;
        insertReviewParams.recommendScore = categoryScore.recommendScore;

        insertReviewParams.expenseAmount = expenseAmount;
        insertReviewParams.reviewType = reviewType;
        insertReviewParams.writerId = token.id;
        insertReviewParams.pictureUrls = s3Urls;
        
        if(reviewType == 'normal') reviewResult = await reviewDao.createReview(connection, insertReviewParams);
        else if(reviewType == 'lasic') reviewResult = await reviewDao.createReview(connection, insertReviewParams);
        else if(reviewType == 'lasec') reviewResult = await reviewDao.createReview(connection, insertReviewParams);
        else if(reviewType == 'smile-lasic') reviewResult = await reviewDao.smileLasicReview(connection, insertReviewParams);
        else if(reviewType == 'lens-insert') reviewResult = await reviewDao.createReview(connection, insertReviewParams);
        else if(reviewType == 'cataract') reviewResult = await reviewDao.cataractReview(connection, insertReviewParams);
    } catch (err) {
        console.log(`App - createReview Service Error\n: ${err.message}`);
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    } finally{
        connection.release();
        return response(baseResponse.SUCCESS, { addedReview: reviewResult });
    }
}