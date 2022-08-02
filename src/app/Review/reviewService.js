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
exports.createReview = async function(hospitalId, userId, score, content) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {

        const insertReviewParams = [hospitalId, userId, score, content];
        const connection = await pool.getConnection(async (conn) => conn);
        const reviewResult = await reviewDao.insertReview(connection, insertReviewParams);

        // 생성된 review의 id
        const reviewId = reviewResult[0].insertId;
        /*for (reviewImgUrl of reviewImgUrls) {
            const insertReviewImgParams = [reviewId, reviewImgUrl];
            const reviewImgResult = await reviewDao.insertReviewImg(connection, insertReviewImgParams);
        }*/

        await connection.commit();

        return response(baseResponse.SUCCESS, { addedReview: reviewId });
    } catch (err) {
        console.log(`App - createReview Service Error\n: ${err.message}`);

        await connection.rollback();

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}