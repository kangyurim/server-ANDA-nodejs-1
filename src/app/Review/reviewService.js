const {pool} = require("../../../config/database");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const reviewDao = require("./reviewDao");
const reviewProvider = require("./reviewProvider");

/**
 * 1. 병원 리뷰 남기기
 * @param {*} hospitalId 
 * @param {*} userId 
 * @param {*} score 
 * @param {*} content 
 * @returns 
 */
exports.createReview = async function(req, hospitalId, reviewType, scoreToJson, content, token) {
    try {
        let insertReviewParams = new Object();
        let categoryScore = new Object();

        let s3Urls = new Array()
        for(var i in req.files)
        {
            s3Urls.push(req.files[i].location)
        }

        if(scoreToJson.friendlyScore == undefined) categoryScore.friendlyScore = 1;
        else categoryScore.friendlyScore = scoreToJson.friendlyScore;

        if(scoreToJson.waitScore == undefined) categoryScore.waitScore = 1;
        else categoryScore.waitScore = scoreToJson.waitScore;

        if(scoreToJson.priceScore == undefined) categoryScore.priceScore = 1;
        else categoryScore.priceScore = scoreToJson.priceScore;

        if(scoreToJson.infoScore == undefined) categoryScore.infoScore = 1;
        else categoryScore.infoScore = scoreToJson.infoScore;

        if(scoreToJson.surgeryScore == undefined) categoryScore.surgeryScore = 1;
        else categoryScore.surgeryScore = scoreToJson.surgeryScore;

        insertReviewParams.hospitalId = hospitalId;
        insertReviewParams.content = content;
        
        insertReviewParams.friendlyScore = categoryScore.friendlyScore;
        insertReviewParams.waitScore = categoryScore.waitScore;
        insertReviewParams.priceScore = categoryScore.priceScore;
        insertReviewParams.infoScore = categoryScore.infoScore;
        insertReviewParams.surgeryScore = categoryScore.surgeryScore;

        insertReviewParams.reviewType = reviewType;
        insertReviewParams.writerId = token.id;
        insertReviewParams.pictureUrls = s3Urls;

        const connection = await pool.getConnection(async (conn) => conn);
        let reviewResult;
        if(reviewType == 'normal') reviewResult = await reviewDao.diagnosisReview(connection, insertReviewParams);
        else if(reviewType == 'lasic') reviewResult = await reviewDao.lasicReview(connection, insertReviewParams);
        else if(reviewType == 'lasec') reviewResult = await reviewDao.lasecReview(connection, insertReviewParams);
        else if(reviewType == 'smile-lasic') reviewResult = await reviewDao.smileLasicReview(connection, insertReviewParams);
        else if(reviewType == 'lens-insert') reviewResult = await reviewDao.lensInsertReview(connection, insertReviewParams);
        else if(reviewType == 'cataract') reviewResult = await reviewDao.cataractReview(connection, insertReviewParams);


        connection.release();

        return response(baseResponse.SUCCESS, { addedReview: reviewResult });
    } catch (err) {
        console.log(`App - createReview Service Error\n: ${err.message}`);

        return errResponse(baseResponse.DB_ERROR);
    }
}