//1. 위도 경도 기반 주변 안과찾기
async function getHospitalLocationByLatitLongit(connection, getHospitalParams){
    /**
     * 기준점: 왕십리(lat=37.5611326, lon=127.033311) 
     * 거리: 3Km
     */
    const sampleQuery = `select  name, cityname, townname, postcode, address, phonenumber, url, xCoordi, yCoordi,
    (6371*acos(cos(radians(37.5611326))*cos(radians(Op.yCoordi))*cos(radians(Op.xCoordi)-radians(127.033311))+sin(radians(37.5611326))*sin(radians(Op.yCoordi)))) AS distance
    from Ophthalmology AS Op
    having distance < 3
    order by distance DESC;`

    const getHospitalLocationByLatitLongitQuery = `select  name, cityname, townname, postcode, address, phonenumber, url, xCoordi, yCoordi,
    (6371*acos(cos(radians(?))*cos(radians(Op.yCoordi))*cos(radians(Op.xCoordi)-radians(?))+sin(radians(?))*sin(radians(Op.yCoordi)))) AS distance
    from Ophthalmology AS Op
    having distance < ?
    order by distance DESC;`
    
    const [getHospitalInfoRow] = await connection.query(getHospitalLocationByLatitLongitQuery, getHospitalParams);
    return getHospitalInfoRow;
}

module.exports = {
    getHospitalLocationByLatitLongit
}