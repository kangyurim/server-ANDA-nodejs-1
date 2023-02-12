const { pool } = require("../../../config/database");
const reviewDao = require("./reviewDao");

//리뷰 조회
exports.retrieveReviewLists = async function(ophthalmologyId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewListResult = await reviewDao.selectReviews(connection, ophthalmologyId);
    connection.release();
    return reviewListResult;
}

//리뷰 상태 확인
exports.checkReviewStatus = async function(reivewId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewStatusResult = await reviewDao.selectReviewStatus(connection, reivewId);
    connection.release();

    return reviewStatusResult[0].status;
}

//라식 병원 탑 9 반환
exports.retrieveLasikTop9 = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const retrieveLasikTop9Result = await reviewDao.retrieveLasikTop9(connection);
    connection.release();

    return retrieveLasikTop9Result;
}