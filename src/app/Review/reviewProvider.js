const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const reviewDao = require("./reviewDao");

//리뷰 조회
exports.retrieveReviewListSimple = async function(ophthalmologyId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        await connection.beginTransaction();
        const reviewListResult = await reviewDao.retrieveReviewListSimple(connection, ophthalmologyId);
        await connection.commit();
        return reviewListResult;
    } catch(err){
        await connection.rollback();
        return errResponse(baseResponse.DB_ERROR);
    } finally{
        connection.release();
    }
    
    
    
}

//리뷰 상태 확인
exports.checkReviewStatus = async function(reivewId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewStatusResult = await reviewDao.selectReviewStatus(connection, reivewId);
    connection.release();

    return reviewStatusResult[0].status;
}

//분야별 병원 탑 9 반환
exports.retrieveTop9 = async function(location, category){
    const connection = await pool.getConnection(async (conn) => conn);
    const retrieveTop9Result = await reviewDao.retrieveTop9(connection, location, category);
    connection.release();

    return retrieveTop9Result;
}