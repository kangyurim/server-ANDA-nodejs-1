async function insertReview(connection, insertReviewParams) {
    const insertReviewQuery = `
        insert into Review(ophthalmologyId, userId, score, reviewText)
        VALUES (?, ?, ?, ?);
    `;

    const insertReviewRow = await connection.query(
        insertReviewQuery,
        insertReviewParams
    );

    return insertReviewRow;
};
async function insertReviewImg(connection, insertReviewImgParams) {
    const insertReviewImgQuery = `
        INSERT INTO ReviewImgUrl(ReviewId, imgUrl)
        VALUES (?, ?);
    `;

    const insertReviewImgRow = await connection.query(insertReviewImgQuery, insertReviewImgParams);

    return insertReviewImgRow;
}

module.exports = {
    insertReview,
    insertReviewImg
}