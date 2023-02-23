const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const reviewDao = require("./reviewDao");

//리뷰 조회
exports.retrieveReviewListSimple = async function(ophthalmologyId) {
    const connection = await pool.getConnection(async (conn) => conn);
    let response;
    try{
        await connection.beginTransaction();
        const reviewListResult = await reviewDao.retrieveReviewListSimple(connection, ophthalmologyId);
        await connection.commit();
        response = reviewListResult;
    } catch(err){
        await connection.rollback();
        response = errResponse(baseResponse.DB_ERROR);
    } finally{
        connection.release();
        return response;
    }
}

//리뷰 상태 확인
exports.checkReviewStatus = async function(reivewId) {
    const connection = await pool.getConnection(async (conn) => conn);
    let response;
    try{
        response = await reviewDao.selectReviewStatus(connection, reivewId);
    }catch(error){
        response = errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
        return response;
    }
}

//분야별 병원 탑 9 반환
exports.retrieveTop9 = async function(location, category){
    const connection = await pool.getConnection(async (conn) => conn);
    let response;
    try{
        response = await reviewDao.retrieveTop9(connection, location, category);
    }catch(err){
        response = errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
        return response;
    }    
}

//위치 기반 리뷰 반환
exports.getReviewArea = async function(location){
    const connection = await pool.getConnection(async (conn) => conn);
    let response;
    try{
        await connection.beginTransaction();
        response = await reviewDao.getReviewArea(connection, location);
        await connection.commit();
    } catch(err){
        await connection.rollback();
        response = errResponse(baseResponse.TRANSACTION_ERROR);
    }  finally{
        connection.release();
        return response;
    }
}

// 리뷰 상세 조회
exports.getDetailReview = async function(reviewType, reviewId){
    const connection = await pool.getConnection(async (conn) => conn);
    let response = new Object();
    try{
        connection.beginTransaction();
        response.textReview = await reviewDao.getDetailReview(connection, reviewType, reviewId);
        response.imageReview = await reviewDao.getDetailImageReview(connection, reviewType, reviewId);
    } catch(err){
        await connection.rollback();
        response.msg = errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
        return response;
    }
}