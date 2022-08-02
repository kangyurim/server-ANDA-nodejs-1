const locationProvider = require("./locationProvider");

const response = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

exports.getHospitalLocationByLatitLongit = async function (req, res) {
    const {xCoordi, yCoordi, within} = req.body;

    if(!xCoordi) res.send(baseResponse.EMPTY_XCOORDI);
    if(!yCoordi) res.send(baseResponse.EMPTY_YCOORDI);
    if(!within) res.send(baseResponse.EMPTY_WITHIN);

    const getHospitalLocationResponse = await locationProvider.getHospitalLocationByLatitLongit(
        xCoordi, 
        yCoordi, 
        within
    )
    return res.send(getHospitalLocationResponse);
}