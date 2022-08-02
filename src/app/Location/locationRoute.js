module.exports = function(app){
    const location = require('./locationController');
    
    // 1. 병원 위치 조회 API
    app.post('/app/location', location.getHospitalLocationByLatitLongit)
}