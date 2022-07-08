const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const baseResponse = require("../../../config/baseResponseStatus");
const baseResponseStatus = require("../../../config/baseResponseStatus");

const locationDao = require("./locationDao");

exports.getHospitalLocationByLatitLongit = async function(req) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const getHospitalParams = [req["yCoordi"], req["xCoordi"], req["yCoordi"], req["within"]];
        const getHospitalLocaResult = await locationDao.getHospitalLocationByLatitLongit(connection, getHospitalParams);

        connection.release();

        return response(baseResponse.SUCCESS, getHospitalLocaResult);
    }
    catch{
        return errResponse(baseResponse.DB_ERROR)
    }
}