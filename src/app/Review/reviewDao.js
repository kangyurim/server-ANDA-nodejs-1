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

    const insertMedicalExpensesQuery = `
    INSERT INTO diagnosisMedicalExpenses (reviewIdx, expense) VALUES(?, ?);
    `;
    const insertMedicalExpensesRow = await connect.query(insertMedicalExpensesQuery, [insertReviewRow[0].insertId, insertReviewParams.expenseAmount]);

    result.insertedInptRes= insertMedicalExpensesRow[0].affectedRows;
    return result
}

//라식 리뷰 작성하기
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

    const insertMedicalExpensesQuery = `
        INSERT INTO LasicMedicalExpenses (reviewIdx, expense) VALUES(?, ?);
    `;
    const insertMedicalExpensesRow = await connect.query(insertMedicalExpensesQuery, [insertReviewRow[0].insertId, insertReviewParams.expenseAmount]);
    
    result.insertedInptRes= insertMedicalExpensesRow[0].affectedRows;

    return result
}

//라섹 리뷰 작성하기
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

    const insertMedicalExpensesQuery = `
    INSERT INTO LasecMedicalExpenses (reviewIdx, expense) VALUES(?, ?);
    `;
    const insertMedicalExpensesRow = await connect.query(insertMedicalExpensesQuery, [insertReviewRow[0].insertId, insertReviewParams.expenseAmount]);

    result.insertedInptRes= insertMedicalExpensesRow[0].affectedRows;
    return result
}

//스마일 라식 리뷰
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

    const insertMedicalExpensesQuery = `
    INSERT INTO SmileLasicMedicalExpenses (reviewIdx, expense) VALUES(?, ?);
    `;
    const insertMedicalExpensesRow = await connect.query(insertMedicalExpensesQuery, [insertReviewRow[0].insertId, insertReviewParams.expenseAmount]);

    result.insertedInptRes= insertMedicalExpensesRow[0].affectedRows;

    return result
}

//렌즈 삽입술 리뷰 작성하기
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

    const insertMedicalExpensesQuery = `
    INSERT INTO LensInsertMedicalExpenses (reviewIdx, expense) VALUES(?, ?);
    `;
    const insertMedicalExpensesRow = await connect.query(insertMedicalExpensesQuery, [insertReviewRow[0].insertId, insertReviewParams.expenseAmount]);

    result.insertedInptRes= insertMedicalExpensesRow[0].affectedRows;
    return result
}

//백내장 수술 리뷰 작성하기
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

    const insertMedicalExpensesQuery = `
    INSERT INTO CataractMedicalExpenses (reviewIdx, expense) VALUES(?, ?);
    `;
    const insertMedicalExpensesRow = await connect.query(insertMedicalExpensesQuery, [insertReviewRow[0].insertId, insertReviewParams.expenseAmount]);
    result.insertedInptRes= insertMedicalExpensesRow[0].affectedRows;

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
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, Review.friendlyScore, Review.waitScore, Review.priceScore, Review.infoScore, Review.recommendScore
                FROM LasicReview Review
                INNER JOIN Ophthalmology O on Review.ophthalmologyId = O.id
                LIMIT 9;
            `
        }
        else{
            const whereClause = dynamicLocationWhereClause(location);
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, Review.friendlyScore, Review.waitScore, Review.priceScore, Review.infoScore, Review.recommendScore
                FROM LasicReview Review
                INNER JOIN Ophthalmology O on Review.ophthalmologyId = O.id
                ${whereClause}
                LIMIT 9;
            `
        }
    }
    else if(type == 'lasec'){
        //라섹 병원 탑 9
        if(location.length == 0){
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, Review.friendlyScore, Review.waitScore, Review.priceScore, Review.infoScore, Review.recommendScore
                FROM LasecReview Review
                INNER JOIN Ophthalmology O on Review.ophthalmologyId = O.id
                LIMIT 9;
            `
        }
        else{
            const whereClause = dynamicLocationWhereClause(location);
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, Review.friendlyScore, Review.waitScore, Review.priceScore, Review.infoScore, Review.recommendScore
                FROM LasecReview Review
                INNER JOIN Ophthalmology O on Review.ophthalmologyId = O.id
                ${whereClause}
                LIMIT 9;
            `
        }
    }
    else if(type == 'smile-lasic'){
        //스마일 라식 병원 탑 9
        if(location.length == 0){
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, Review.friendlyScore, Review.waitScore, Review.priceScore, Review.infoScore, Review.recommendScore
                FROM SmileLasicReview Review
                INNER JOIN Ophthalmology O on Review.ophthalmologyId = O.id
                LIMIT 9;
            `
        }
        else{
            const whereClause = dynamicLocationWhereClause(location);
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, Review.friendlyScore, Review.waitScore, Review.priceScore, Review.infoScore, Review.recommendScore
                FROM SmileLasicReview Review
                INNER JOIN Ophthalmology O on Review.ophthalmologyId = O.id
                ${whereClause}
                LIMIT 9;
            `
        }
    }
    else if(type == 'lens-insert'){
        //렌즈 삽입 병원 탑 9
        if(location.length == 0){
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, Review.friendlyScore, Review.waitScore, Review.priceScore, Review.infoScore, Review.recommendScore
                FROM LensInsertReview Review
                INNER JOIN Ophthalmology O on Review.ophthalmologyId = O.id
                LIMIT 9;
            `
        }
        else{
            const whereClause = dynamicLocationWhereClause(location);
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, Review.friendlyScore, Review.waitScore, Review.priceScore, Review.infoScore, Review.recommendScore
                FROM LensInsertReview Review
                INNER JOIN Ophthalmology O on Review.ophthalmologyId = O.id
                ${whereClause}
                LIMIT 9;
            `
        }
    }
    else if(type == 'cataract'){
        //백내장 수술 병원 탑 9
        if(location.length == 0){
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName,  C.friendlyScore, C.waitScore, C.priceScore, C.infoScore, C.recommendScore
                FROM CataractReview Review
                INNER JOIN Ophthalmology O on Review.ophthalmologyId = O.id
                LIMIT 9;
            `
        }
        else{
            const whereClause = dynamicLocationWhereClause(location);
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, C.friendlyScore, C.waitScore, C.priceScore, C.infoScore, C.recommendScore
                FROM CataractReview Review
                INNER JOIN Ophthalmology O on C.ophthalmologyId = O.id
                ${whereClause}
                ORDER BY Review.score DESC
                LIMIT 9;
            `
        }
    }
    else if(type == 'diagnosis'){
        //일반 진료 병원 탑 9
        if(location.length == 0){
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, D.score AS score
                FROM diagnosisReview Review
                INNER JOIN Ophthalmology O on Review.ophthalmologyId = O.id
                LIMIT 9;
            `
        }
        else{
            const whereClause = dynamicLocationWhereClause(location);
            retrieveTop9Query = `
                SELECT O.id AS HospitalId, O.name AS HospitalName, O.cityName AS cityName, O.townName AS townName, D.score AS score
                FROM diagnosisReview Review
                INNER JOIN Ophthalmology O on Review.ophthalmologyId = O.id
                ${whereClause}
                LIMIT 9;
            `
        }
    }
   
    

    const retrieveLasikTop9Result = await connect.query(retrieveTop9Query);

    return retrieveLasikTop9Result[0];
}

async function getReviewArea(connection, location){
    let getReviewAreaResult = new Object();
    const whereClause = dynamicLocationWhereClause(location);
    
    const lasicReview = `
        SELECT O.id AS hospitalId, O.name AS hospitalName, cityName, townName, address, reviewText, U.nickname, friendlyScore, waitScore, priceScore, infoScore, recommendScore
        FROM Ophthalmology AS O
        INNER JOIN LasicReview Reivew on O.id = Reivew.ophthalmologyId
        INNER JOIN User U on Reivew.userId = U.id
        ${whereClause} AND Reivew.status = 'Activated'
        ORDER BY Reivew.createdAt DESC
        LIMIT 10;
    `
    const lasicReviewRow = await connection.query(lasicReview);
    getReviewAreaResult.lasicAreaReview = lasicReviewRow[0];

    const lasecReview = `
        SELECT O.id AS hospitalId, O.name AS hospitalName, cityName, townName, address, reviewText, U.nickname, friendlyScore, waitScore, priceScore, infoScore, recommendScore
        FROM Ophthalmology AS O
        INNER JOIN LasecReview Reivew on O.id = Reivew.ophthalmologyId
        INNER JOIN User U on Reivew.userId = U.id
        ${whereClause} AND Reivew.status = 'Activated'
        ORDER BY Reivew.createdAt DESC
        LIMIT 10;
    `
    const lasecReviewRow = await connection.query(lasecReview);
    getReviewAreaResult.lasecAreaReview = lasecReviewRow[0];

    const lensInsertReview = `
        SELECT O.id AS hospitalId, O.name AS hospitalName, cityName, townName, address, reviewText, U.nickname, friendlyScore, waitScore, priceScore, infoScore, recommendScore
        FROM Ophthalmology AS O
        INNER JOIN LensInsertReview Reivew on O.id = Reivew.ophthalmologyId
        INNER JOIN User U on Reivew.userId = U.id
        ${whereClause} AND Reivew.status = 'Activated'
        ORDER BY Reivew.createdAt DESC
        LIMIT 10;
    `
    const lensInsertReviewRow = await connection.query(lensInsertReview);
    getReviewAreaResult.lensInsertAreaReview = lensInsertReviewRow[0];

    const smileLasicReview = `
        SELECT O.id AS hospitalId, O.name AS hospitalName, cityName, townName, address, reviewText, U.nickname, friendlyScore, waitScore, priceScore, infoScore, recommendScore
        FROM Ophthalmology AS O
        INNER JOIN SmileLasicReview Reivew on O.id = Reivew.ophthalmologyId
        INNER JOIN User U on Reivew.userId = U.id
        ${whereClause} AND Reivew.status = 'Activated'
        ORDER BY Reivew.createdAt DESC
        LIMIT 10;
    `
    const smileLasicReviewRow = await connection.query(smileLasicReview);
    getReviewAreaResult.smileLasicAreaReview = smileLasicReviewRow[0];

    const cataractReview = `
        SELECT O.id AS hospitalId, O.name AS hospitalName, cityName, townName, address, reviewText, U.nickname, friendlyScore, waitScore, priceScore, infoScore, recommendScore
        FROM Ophthalmology AS O
        INNER JOIN CataractReview Reivew on O.id = Reivew.ophthalmologyId
        INNER JOIN User U on Reivew.userId = U.id
        ${whereClause} AND Reivew.status = 'Activated'
        ORDER BY Reivew.createdAt DESC
        LIMIT 10;
    `
    const cataractReviewRow = await connection.query(cataractReview);
    getReviewAreaResult.cataractAreaReview = cataractReviewRow[0];
    
    const diagnosisReview = `
        SELECT O.id AS hospitalId, O.name AS hospitalName, cityName, townName, address, reviewText, U.nickname, friendlyScore, waitScore, priceScore, infoScore, recommendScore
        FROM Ophthalmology AS O
        INNER JOIN diagnosisReview Reivew on O.id = Reivew.ophthalmologyId
        INNER JOIN User U on Reivew.userId = U.id
        ${whereClause} AND Reivew.status = 'Activated'
        ORDER BY Reivew.createdAt DESC
        LIMIT 10;
    `
    const diagnosisReviewRow = await connection.query(diagnosisReview);
    getReviewAreaResult.diagnosisAreaReview = diagnosisReviewRow[0];

    return getReviewAreaResult

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
    getReviewArea,
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