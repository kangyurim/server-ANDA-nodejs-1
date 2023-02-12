
/*// 안과 리뷰 조회
async function selectOphthalmologyReviews(connection, ophthalmologyId) {
    const selectOphthalmologyReviewsQuery = `
        SELECT r.reviewId as reviewId,
            rm.picURL as reviewPicURL
        FROM Review as r
            join ReviewMedia as rm on rm.reviewId = r.reviewId and rm.status = 'Activated'
            join User as u on u.userId = r.userId
            join Ophthalmology as o on o.ophthalmologyId = r.ophthalmologyId
        WHERE r.status = 'Activated' and r.ophthalmologyId = ?
        group by r.reviewId
        HAVING min(ri.reviewImgUrlId)
        order by r.reviewId;  
    `;
    const [ophthalmologyReviewsRows] = await connection.query(selectOphthalmologyReviewsQuery, ophthalmologyId);

    return ophthalmologyReviewsRows;
}*/

// 리뷰 조회
async function selectReviews(connection, opththalmologyId) {
    const selectReviewsQuery = `
        SELECT r.Id as reviewId,
            u.Id as userId,
            u.nickname as nickname,
            r.reviewText as reviewText,
            r.score as score,
            r.reviewLikeCount as reviewLikeCount,
            m.picURL as media
        FROM Review as r
            left outer join(ReviewMedia as m, User as u) on m.reviewId = r.id AND u.id = r.userId
        WHERE r.status = 'Activated' and r.ophthalmologyId = ?
            group by r.Id;
    `;

    const [reviewRows] = await connection.query(selectReviewsQuery, opththalmologyId);

    return reviewRows;
}

async function selectReviewStatus(connection, reviewId) {
    const selectReviewStatusQuery = `
        SELECT status
        FROM Review
        WHERE review.Id = ?;
    `;

    const [reviewStatusRow] = await connection.query(selectReviewStatusQuery, reviewId);

    return reviewStatusRow;
}

async function insertReview(connect, insertReviewParams) {
    let result = new Object();
    const insertReviewQuery = `
        insert into Review(ophthalmologyId, userId, score, reviewText)
        VALUES (?, ?, ?, ?);
    `;
    const insertReviewRow = await connect.query(insertReviewQuery, [insertReviewParams.hospitalId, insertReviewParams.writerId, insertReviewParams.score, insertReviewParams.content]);

    if(insertReviewRow[0].affectedRows == 1)
    {
        result.titleInptRes = 'SUCCESS';
        const insertId = insertReviewRow[0].insertId;
       
        if(insertReviewParams.pictureUrls.length != 0)
        {
            for(var i in insertReviewParams.pictureUrls)
            {   const insertMediaQuery = `INSERT INTO ReviewMedia(reviewId, picURL) VALUES(?, ?)`
                const insertMediaQueryRes = await connect.query(insertMediaQuery, [insertId ,insertReviewParams.pictureUrls[i]])
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

async function lasicReview(connect, insertReviewParams) {
    let result = new Object();
    const insertReviewQuery = `
        insert into LasicReview(ophthalmologyId, userId, score, reviewText)
        VALUES (?, ?, ?, ?);
    `;
    const insertReviewRow = await connect.query(insertReviewQuery, [insertReviewParams.hospitalId, insertReviewParams.writerId, insertReviewParams.score, insertReviewParams.content]);

    if(insertReviewRow[0].affectedRows == 1)
    {
        result.titleInptRes = 'SUCCESS';
        const insertId = insertReviewRow[0].insertId;
       
        if(insertReviewParams.pictureUrls.length != 0)
        {
            for(var i in insertReviewParams.pictureUrls)
            {   const insertMediaQuery = `INSERT INTO LasicReviewMedia(reviewId, picURL) VALUES(?, ?)`
                const insertMediaQueryRes = await connect.query(insertMediaQuery, [insertId ,insertReviewParams.pictureUrls[i]])
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

async function lasecReview(connect, insertReviewParams) {
    let result = new Object();
    const insertReviewQuery = `
        insert into LasecReview(ophthalmologyId, userId, score, reviewText)
        VALUES (?, ?, ?, ?);
    `;
    const insertReviewRow = await connect.query(insertReviewQuery, [insertReviewParams.hospitalId, insertReviewParams.writerId, insertReviewParams.score, insertReviewParams.content]);

    if(insertReviewRow[0].affectedRows == 1)
    {
        result.titleInptRes = 'SUCCESS';
        const insertId = insertReviewRow[0].insertId;
       
        if(insertReviewParams.pictureUrls.length != 0)
        {
            for(var i in insertReviewParams.pictureUrls)
            {   const insertMediaQuery = `INSERT INTO LasecReviewMedia(reviewId, picURL) VALUES(?, ?)`
                const insertMediaQueryRes = await connect.query(insertMediaQuery, [insertId, insertReviewParams.pictureUrls[i]])
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

async function smileLasicReview(connect, insertReviewParams) {
    let result = new Object();
    const insertReviewQuery = `
        insert into SmileLasicReview(ophthalmologyId, userId, score, reviewText)
        VALUES (?, ?, ?, ?);
    `;
    const insertReviewRow = await connect.query(insertReviewQuery, insertReviewParams.hospitalId, insertReviewParams.writerId, insertReviewParams.score, insertReviewParams.content);

    if(insertReviewRow[0].affectedRows == 1)
    {
        result.titleInptRes = 'SUCCESS';
        const insertId = insertReviewRow[0].insertId;
       
        if(insertReviewParams.pictureUrls.length != 0)
        {
            for(var i in insertReviewParams.pictureUrls)
            {   const insertMediaQuery = `INSERT INTO SmileLasicReviewMedia(reviewId, picURL) VALUES(?, ?)`
                const insertMediaQueryRes = await connect.query(insertMediaQuery, [insertId, insertReviewParams.pictureUrls[i]])
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

async function lensInsertReview(connect, insertReviewParams) {
    let result = new Object();
    const insertReviewQuery = `
        insert into LensInsertReview(ophthalmologyId, userId, score, reviewText)
        VALUES (?, ?, ?, ?);
    `;
    const insertReviewRow = await connect.query(insertReviewQuery, insertReviewParams.hospitalId, insertReviewParams.writerId, insertReviewParams.score, insertReviewParams.content);

    if(insertReviewRow[0].affectedRows == 1)
    {
        result.titleInptRes = 'SUCCESS';
        const insertId = insertReviewRow[0].insertId;
       
        if(insertReviewParams.pictureUrls.length != 0)
        {
            for(var i in insertReviewParams.pictureUrls)
            {   const insertMediaQuery = `INSERT INTO LensInsertReviewMedia(reviewId, picURL) VALUES(?, ?)`
                const insertMediaQueryRes = await connect.query(insertMediaQuery, [insertId, insertReviewParams.pictureUrls[i]])
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

async function retrieveLasikTop9(connect){
    const retrieveLasikTop9Query = `
    SELECT * FROM LasicReview
    ORDER BY score ASC;
    `

    const retrieveLasikTop9Result = await connect.query(retrieveLasikTop9Query);

    return retrieveLasikTop9Result[0];
}

module.exports = {
    selectReviews,
    selectReviewStatus,
    insertReview,
    insertReviewImg,
    lasicReview,
    lasecReview,
    smileLasicReview,
    lensInsertReview,
    retrieveLasikTop9
}