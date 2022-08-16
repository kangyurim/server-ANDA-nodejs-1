async function insertReview(connect, insertReviewParams) {
    let result = new Object();
    console.log(insertReviewParams)
    const insertReviewQuery = `
        insert into Review(ophthalmologyId, userId, score, reviewText)
        VALUES (${insertReviewParams.hospitalId}, ${insertReviewParams.writerId}, ${insertReviewParams.score}, '${insertReviewParams.content}');
    `;
    console.log("good 6");
    const insertReviewRow = await connect.query(insertReviewQuery);

    if(insertReviewRow[0].affectedRows == 1)
    {
        result.titleInptRes = 'SUCCESS';
        const insertId = insertReviewRow[0].insertId;
       
        if(insertReviewParams.pictureUrls.length != 0)
        {
            console.log(insertId);
            for(var i in insertReviewParams.pictureUrls)
            {   const insertMediaQuery = `INSERT INTO ReviewMedia(reviewId, picURL) VALUES(${insertId}, ?)`
                const insertMediaQueryRes = await connect.query(insertMediaQuery, insertReviewParams.pictureUrls[i])
                if(insertMediaQueryRes[0].affectedRows != 1) 
                {
                    result.mediaInptRes = 'FAIL';
                    break;
                }
            }
            result.mediaInptRes = 'SUCCESS';
        }
        else if(insertReviewParams.pictureUrls.length == 0)
        {
            result.mediaInptRes = 'NULL BUT SUCCESS';
        }
    }
    else  result.titleInptRes = 'FAIL';

    return result
}

async function insertReviewImg(connect, insertReviewImgParams) {
    const insertReviewImgQuery = `
        INSERT INTO ReviewImgUrl(ReviewId, imgUrl)
        VALUES (?, ?);
    `;

    const insertReviewImgRow = await connect.query(insertReviewImgQuery, insertReviewImgParams);

    return insertReviewImgRow;
}

module.exports = {
    insertReview,
    insertReviewImg
}