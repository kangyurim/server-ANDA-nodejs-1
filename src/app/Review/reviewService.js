const {pool} = require("../../../config/database");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const reviewDao = require("./reviewDao");
const reviewProvider = require("./reviewProvider");

// 리뷰 작성
exports.createReview = async function(userIdx, content, reviewImgUrls) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        await connection.beginTransaction();

        const insertReviewParams = [userIdx, content];
        const reviewResult = await reviewDao.insertReview(connection, insertReviewParams);

        // 생성된 review의 idx
        const reviewIdx = reviewResult[0].insertId;

        for (reviewImgUrl of reviewImgUrls) {
            const insertReviewImgParams = [reviewIdx, reviewImgUrl];
            const reviewImgResult = await reviewDao.insertReviewImg(connection, insertReviewImgParams);
        }

        await connection.commit();

        return response(baseResponse.SUCCESS, { addedReview: reviewIdx });
    } catch (err) {
        console.log(`App - createReview Service Error\n: ${err.message}`);

        await connection.rollback();

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}