const { pool } = require("../../../config/database");
const reviewDao = require("./reviewDao");

//리뷰 조회
exports.retrieveReviewLists = async function(ophthalmologyId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewListResult = await reviewDao.selectReviews(connection, ophthalmologyId);
    connection.release();
    return reviewListResult;
}

exports.checkReviewStatus = async function(reivewId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewStatusResult = await reviewDao.selectReviewStatus(connection, reivewId);
    connection.release();

    return reviewStatusResult[0].status;
}