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
    selectReviews,
    selectReviewStatus,
    insertReview,
    insertReviewImg
}