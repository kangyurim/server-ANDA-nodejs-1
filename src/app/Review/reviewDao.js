
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
    const insertReviewRow = await connect.query(insertReviewQuery, [insertReviewParams.hospitalId, insertReviewParams.writerId, insertReviewParams.score, insertReviewParams.content]);

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
    const insertReviewRow = await connect.query(insertReviewQuery, [insertReviewParams.hospitalId, insertReviewParams.writerId, insertReviewParams.score, insertReviewParams.content]);

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

async function cataractReview(connect, insertReviewParams) {
    let result = new Object();
    const insertReviewQuery = `
        insert into CataractReview(ophthalmologyId, userId, score, reviewText)
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
            {   const insertMediaQuery = `INSERT INTO CataractReviewMedia(reviewId, picURL) VALUES(?, ?)`
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

async function retrieveTop9(connect, location, type){
    let retrieveTop9Query;

    if(type == 'lasic'){
        //라식 병원 탑 9
        if(location.length == 0){
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, L.score AS score
                FROM LasicReview L
                INNER JOIN Ophthalmology O on L.ophthalmologyId = O.id
                ORDER BY L.score DESC
                LIMIT 9;
            `
        }
        else{
            const whereClause = dynamicLocationWhereClause(location);
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, L.score AS score
                FROM LasicReview L
                INNER JOIN Ophthalmology O on L.ophthalmologyId = O.id
                ${whereClause}
                ORDER BY L.score DESC
                LIMIT 9;
            `
        }
    }
    else if(type == 'lasec'){
        //라섹 병원 탑 9
        if(location.length == 0){
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, L.score AS score
                FROM LasecReview L
                INNER JOIN Ophthalmology O on L.ophthalmologyId = O.id
                ORDER BY L.score DESC
                LIMIT 9;
            `
        }
        else{
            const whereClause = dynamicLocationWhereClause(location);
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, L.score AS score
                FROM LasecReview L
                INNER JOIN Ophthalmology O on L.ophthalmologyId = O.id
                ${whereClause}
                ORDER BY L.score DESC
                LIMIT 9;
            `
        }
    }
    else if(type == 'smile-lasic'){
        //스마일 라식 병원 탑 9
        if(location.length == 0){
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, L.score AS score
                FROM SmileLasicReview L
                INNER JOIN Ophthalmology O on L.ophthalmologyId = O.id
                ORDER BY L.score DESC
                LIMIT 9;
            `
        }
        else{
            const whereClause = dynamicLocationWhereClause(location);
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, L.score AS score
                FROM SmileLasicReview L
                INNER JOIN Ophthalmology O on L.ophthalmologyId = O.id
                ${whereClause}
                ORDER BY L.score DESC
                LIMIT 9;
            `
        }
    }
    else if(type == 'lens-insert'){
        //렌즈 삽입 병원 탑 9
        if(location.length == 0){
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, L.score AS score
                FROM LensInsertReview L
                INNER JOIN Ophthalmology O on L.ophthalmologyId = O.id
                ORDER BY L.score DESC
                LIMIT 9;
            `
        }
        else{
            const whereClause = dynamicLocationWhereClause(location);
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, L.score AS score
                FROM LensInsertReview L
                INNER JOIN Ophthalmology O on L.ophthalmologyId = O.id
                ${whereClause}
                ORDER BY L.score DESC
                LIMIT 9;
            `
        }
    }
    else if(type == 'cataract'){
        //백내장 수술 병원 탑 9
        if(location.length == 0){
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, C.score AS score
                FROM CataractReview C
                INNER JOIN Ophthalmology O on C.ophthalmologyId = O.id
                ORDER BY C.score DESC
                LIMIT 9;
            `
        }
        else{
            const whereClause = dynamicLocationWhereClause(location);
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, C.score AS score
                FROM CataractReview C
                INNER JOIN Ophthalmology O on C.ophthalmologyId = O.id
                ${whereClause}
                ORDER BY C.score DESC
                LIMIT 9;
            `
        }
    }
    else if(type == 'diagnosis'){
        //일반 진료 병원 탑 9
        if(location.length == 0){
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, D.score AS score
                FROM diagnosisReview D
                INNER JOIN Ophthalmology O on D.ophthalmologyId = O.id
                ORDER BY D.score DESC
                LIMIT 9;
            `
        }
        else{
            const whereClause = dynamicLocationWhereClause(location);
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, D.score AS score
                FROM diagnosisReview D
                INNER JOIN Ophthalmology O on D.ophthalmologyId = O.id
                ${whereClause}
                ORDER BY D.score DESC
                LIMIT 9;
            `
        }
    }
   
    

    const retrieveLasikTop9Result = await connect.query(retrieveTop9Query);

    return retrieveLasikTop9Result[0];
}

function dynamicLocationWhereClause(location){
    let whereClause = '';
    if(location.size != 0){
        whereClause += 'WHERE ';
        for(let i = 0; i < location.length; i++){
            if(i == 0){
                whereClause += 'townName = \'' + location[i] + '\'';
            }
            else{
                whereClause += ' OR townName = \'' + location[i] + '\'';
            }
        }
    }

    return whereClause;
}

module.exports = {
    selectReviews,
    selectReviewStatus,
    insertReview,
    insertReviewImg,
    lasicReview,
    lasecReview,
    cataractReview,
    smileLasicReview,
    lensInsertReview,
    retrieveTop9,
}