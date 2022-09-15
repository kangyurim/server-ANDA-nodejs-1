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
exports.createReview = async function(req, hospitalId, reviewType, score,content, token) {
    try {
        let insertReviewParams = new Object();
        let s3Urls = new Array()
        for(var i in req.files)
        {
            s3Urls.push(req.files[i].location)
        }
        insertReviewParams.hospitalId = hospitalId;
        insertReviewParams.content = content;
        insertReviewParams.score = score;
        insertReviewParams.reviewType = reviewType;
        insertReviewParams.writerId = token.id;
        insertReviewParams.pictureUrls = s3Urls;

        const connection = await pool.getConnection(async (conn) => conn);
        let reviewResult;
        if(reviewType == 'normal') reviewResult = await reviewDao.insertReview(connection, insertReviewParams);
        if(reviewType == 'lasic') reviewResult = await reviewDao.lasicReview(connection, insertReviewParams);
        if(reviewType == 'lasec') reviewResult = await reviewDao.lasecReview(connection, insertReviewParams);
        if(reviewType == 'smile-lasic') reviewResult = await reviewDao.smileLasicReview(connection, insertReviewParams);
        if(reviewType == 'lens-insert') reviewResult = await reviewDao.lensInsertReview(connection, insertReviewParams);


        connection.release();

        return response(baseResponse.SUCCESS, { addedReview: reviewResult });
    } catch (err) {
        console.log(`App - createReview Service Error\n: ${err.message}`);

        return errResponse(baseResponse.DB_ERROR);
    }
}