const locationProvider = require("./locationProvider");

const response = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

exports.getHospitalLocationByLatitLongit = async function (req, res) {
    const getHospitalLocationResponse = await locationProvider.getHospitalLocationByLatitLongit(
        req.params
    )
    return res.send(getHospitalLocationResponse);
}