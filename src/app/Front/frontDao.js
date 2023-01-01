//배너 조회
async function getBannerList(connection){
    const query = `
        SELECT andaInfoName, andaInfoThumbnailPicture, andaInfoContentPicture, andaInfoText
        FROM Banner
        WHERE status='Activated'
    `

    const [bannerRow] = await connection.query(query);

    return bannerRow;
}

module.exports = {
    getBannerList
}