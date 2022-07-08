module.exports = function(app){
    const location = require('./locationController');
    

    // 1. 병원 위치 조회 API
    app.get('/app/location/:xCoordi/:yCoordi/:within', location.getHospitalLocationByLatitLongit)
}