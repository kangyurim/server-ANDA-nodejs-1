async function insertReview(connection, insertReviewParams) {
    const insertReviewQuery = `
        INSERT INTO Review(userIdx, content)
        VALUES (?, ?);
    `;

    const insertReviewRow = await connection.query(insertReviewQuery, insertReviewParams);

    return insertReviewRow;
};