module.exports = function(app){
    const frontController = require('./frontController');

    //1. 배너 조회
    app.get('/app/banners', frontController.getbanners);
}