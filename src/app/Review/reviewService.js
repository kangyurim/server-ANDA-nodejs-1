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
exports.createReview = async function(req, hospitalId, score, content, token) {
    try {
        console.log("good 4");
        let insertReviewParams = new Object();
        let s3Urls = new Array()
        for(var i in req.files)
        {
            s3Urls.push(req.files[i].location)
        }
        console.log("good 5");
        insertReviewParams.hospitalId = hospitalId;
        insertReviewParams.content = content;
        insertReviewParams.score = score;
        insertReviewParams.writerId = token.id;
        insertReviewParams.pictureUrls = s3Urls;

        const connection = await pool.getConnection(async (conn) => conn);
        const reviewResult = await reviewDao.insertReview(connection, insertReviewParams);

        await connection.release();

        return response(baseResponse.SUCCESS, { addedReview: reviewResult });
    } catch (err) {
        console.log(`App - createReview Service Error\n: ${err.message}`);

        return errResponse(baseResponse.DB_ERROR);
    }
}