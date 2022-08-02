const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const baseResponse = require("../../../config/baseResponseStatus");
const baseResponseStatus = require("../../../config/baseResponseStatus");

const locationDao = require("./locationDao");

exports.getHospitalLocationByLatitLongit = async function(xCoordi, yCoordi, within) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const getHospitalParams = [yCoordi, xCoordi, yCoordi, within];
        const getHospitalLocaResult = await locationDao.getHospitalLocationByLatitLongit(connection, getHospitalParams);

        connection.release();

        return response(baseResponse.SUCCESS, getHospitalLocaResult);
    }
    catch{
        return errResponse(baseResponse.DB_ERROR)
    }
}