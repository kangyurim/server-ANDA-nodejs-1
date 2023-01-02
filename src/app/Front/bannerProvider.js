const { pool } = require("../../../config/database");
const bannerDao = require("./frontDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// 1. 배너 가져오기
exports.retrieveBannerList = async function(req, res){
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const bannerList = await bannerDao.getBannerList(connection);
        var asResponse = new Object();
        asResponse.banners = bannerList;
        return response(baseResponse.SUCCESS, asResponse);
    }catch (err) {
        return errResponse(baseResponse.DB_ERROR);
    }
   
}