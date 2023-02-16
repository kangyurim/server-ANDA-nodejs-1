// 리뷰 조회
async function retrieveReviewListSimple(connection, opththalmologyId) {
    let fianlSimpleReviewList = new Object();
    
    const lasicSimpleReview = `
        SELECT O.id AS hospitalName, cityName, townName, address, reviewText, U.nickname, friendlyScore, waitScore, priceScore, infoScore, recommendScore
        FROM Ophthalmology AS O
        INNER JOIN LasicReview Reivew on O.id = Reivew.ophthalmologyId
        INNER JOIN User U on Reivew.userId = U.id
        WHERE Reivew.status = 'Activated' AND O.id = ?
        ORDER BY Reivew.createdAt DESC
        LIMIT 10;
    `;
    const lasicReviewRow = await connection.query(lasicSimpleReview, opththalmologyId);
    fianlSimpleReviewList.lasicSimpleReview = lasicReviewRow[0];

    const lasecSimpleReview = `
        SELECT O.id AS hospitalName, cityName, townName, address, reviewText, U.nickname, friendlyScore, waitScore, priceScore, infoScore, recommendScore
        FROM Ophthalmology AS O
        INNER JOIN LasecReview Reivew on O.id = Reivew.ophthalmologyId
        INNER JOIN User U on Reivew.userId = U.id
        WHERE Reivew.status = 'Activated' AND O.id = ?
        ORDER BY Reivew.createdAt DESC
        LIMIT 10;
    `
    const lasecReviewRow = await connection.query(lasecSimpleReview, opththalmologyId);
    fianlSimpleReviewList.lasecSimpleReview = lasecReviewRow[0];

    const lensInsertSimpleReview = `
        SELECT O.id AS hospitalName, cityName, townName, address, reviewText, U.nickname, friendlyScore, waitScore, priceScore, infoScore, recommendScore
        FROM Ophthalmology AS O
        INNER JOIN LensInsertReview Reivew on O.id = Reivew.ophthalmologyId
        INNER JOIN User U on Reivew.userId = U.id
        WHERE Reivew.status = 'Activated' AND O.id = ?
        ORDER BY Reivew.createdAt DESC
        LIMIT 10;
    `
    const lensInsertReviewRow = await connection.query(lensInsertSimpleReview, opththalmologyId);
    fianlSimpleReviewList.lensInsertSimpleReview = lensInsertReviewRow[0];

    const smileLasicReview = `
        SELECT O.id AS hospitalName, cityName, townName, address, reviewText, U.nickname, friendlyScore, waitScore, priceScore, infoScore, recommendScore
        FROM Ophthalmology AS O
        INNER JOIN LensInsertReview Reivew on O.id = Reivew.ophthalmologyId
        INNER JOIN User U on Reivew.userId = U.id
        WHERE Reivew.status = 'Activated' AND O.id = ?
        ORDER BY Reivew.createdAt DESC
        LIMIT 10;
    `
    const smileLasicReviewRow = await connection.query(smileLasicReview, opththalmologyId);
    fianlSimpleReviewList.smileLasicReview = smileLasicReviewRow[0];

    const cataractReview = `
        SELECT O.id AS hospitalName, cityName, townName, address, reviewText, U.nickname, friendlyScore, waitScore, priceScore, infoScore, recommendScore
        FROM Ophthalmology AS O
        INNER JOIN CataractReview Reivew on O.id = Reivew.ophthalmologyId
        INNER JOIN User U on Reivew.userId = U.id
        WHERE Reivew.status = 'Activated' AND O.id = ?
        ORDER BY Reivew.createdAt DESC
        LIMIT 10;
    `
    const cataractReviewRow = await connection.query(cataractReview, opththalmologyId);
    fianlSimpleReviewList.cataractReview = cataractReviewRow[0];

    const diagnosisReview = `
        SELECT O.id AS hospitalName, cityName, townName, address, reviewText, U.nickname, friendlyScore, waitScore, priceScore, infoScore, recommendScore
        FROM Ophthalmology AS O
        INNER JOIN diagnosisReview Reivew on O.id = Reivew.ophthalmologyId
        INNER JOIN User U on Reivew.userId = U.id
        WHERE Reivew.status = 'Activated' AND O.id = 10000
        ORDER BY Reivew.createdAt DESC
        LIMIT 10;
    `
    const diagnosisReviewRow = await connection.query(diagnosisReview, opththalmologyId);
    fianlSimpleReviewList.diagnosisReview = diagnosisReviewRow[0];


    return fianlSimpleReviewList;
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

async function diagnosisReview(connect, insertReviewParams) {
    let result = new Object();
    const insertReviewQuery = `
        insert into diagnosisReview(ophthalmologyId, userId, reviewText, friendlyScore, waitScore, priceScore, infoScore, recommendScore)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);    
    `;
    const insertReviewRow = await connect.query(insertReviewQuery, [insertReviewParams.hospitalId, insertReviewParams.writerId, insertReviewParams.content, insertReviewParams.friendlyScore, insertReviewParams.waitScore, insertReviewParams.priceScore, insertReviewParams.infoScore, insertReviewParams.recommendScore]);

    if(insertReviewRow[0].affectedRows == 1)
    {
        result.titleInptRes = 'SUCCESS';
        const insertId = insertReviewRow[0].insertId;
       
        if(insertReviewParams.pictureUrls.length != 0)
        {
            for(var i in insertReviewParams.pictureUrls)
            {   const insertMediaQuery = `INSERT INTO diagnosisReviewMedia(reviewId, picURL) VALUES(?, ?)`
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
        insert into LasicReview(ophthalmologyId, userId, reviewText, friendlyScore, waitScore, priceScore, infoScore, recommendScore)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);    
    `;
    const insertReviewRow = await connect.query(insertReviewQuery, [insertReviewParams.hospitalId, insertReviewParams.writerId, insertReviewParams.content, insertReviewParams.friendlyScore, insertReviewParams.waitScore, insertReviewParams.priceScore, insertReviewParams.infoScore, insertReviewParams.recommendScore]);

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
        insert into LasecReview(ophthalmologyId, userId, reviewText, friendlyScore, waitScore, priceScore, infoScore, recommendScore)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const insertReviewRow = await connect.query(insertReviewQuery, [insertReviewParams.hospitalId, insertReviewParams.writerId, insertReviewParams.content, insertReviewParams.friendlyScore, insertReviewParams.waitScore, insertReviewParams.priceScore, insertReviewParams.infoScore, insertReviewParams.recommendScore]);

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
        insert into SmileLasicReview(ophthalmologyId, userId, reviewText, friendlyScore, waitScore, priceScore, infoScore, recommendScore)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const insertReviewRow = await connect.query(insertReviewQuery, [insertReviewParams.hospitalId, insertReviewParams.writerId, insertReviewParams.content, insertReviewParams.friendlyScore, insertReviewParams.waitScore, insertReviewParams.priceScore, insertReviewParams.infoScore, insertReviewParams.recommendScore]);

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
        insert into LensInsertReview(ophthalmologyId, userId, reviewText, friendlyScore, waitScore, priceScore, infoScore, recommendScore)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const insertReviewRow = await connect.query(insertReviewQuery, [insertReviewParams.hospitalId, insertReviewParams.writerId, insertReviewParams.content, insertReviewParams.friendlyScore, insertReviewParams.waitScore, insertReviewParams.priceScore, insertReviewParams.infoScore, insertReviewParams.recommendScore]);

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
        INSERT INTO CataractReview(ophthalmologyId, userId, reviewText, friendlyScore, waitScore, priceScore, infoScore, recommendScore)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const insertReviewRow = await connect.query(insertReviewQuery, [insertReviewParams.hospitalId, insertReviewParams.writerId, insertReviewParams.content, insertReviewParams.friendlyScore, insertReviewParams.waitScore, insertReviewParams.priceScore, insertReviewParams.infoScore, insertReviewParams.recommendScore]);

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
    retrieveReviewListSimple,
    selectReviewStatus,
    diagnosisReview,
    insertReviewImg,
    lasicReview,
    lasecReview,
    cataractReview,
    smileLasicReview,
    lensInsertReview,
    retrieveTop9,
}