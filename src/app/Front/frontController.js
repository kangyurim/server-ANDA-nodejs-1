const {response} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const bannerProvider = require("./bannerProvider");

exports.getbanners = async function(req, res){
    const bannerListResult = await bannerProvider.retrieveBannerList();

    return res.send(bannerListResult);
}