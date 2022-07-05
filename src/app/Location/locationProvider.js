const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
import {queryParams} from '../../../config/publicAPIKey';

const locationDao = require("./locationDao");

exports.getHospitalLocationByLatitLongit = async function() {
    var request = require('request');
    let parseString = require('xml2js')

    var url = 'http://apis.data.go.kr/B552657/HsptlAsembySearchService/getHsptlMdcncLcinfoInqire';
    queryParams += '&' + encodeURIComponent('WGS84_LON=127.085156592737&WGS84_LAT=37.4881325624879&pageNo=1&numOfRows=1'); /* */

    const requestUrl = url+queryParams

    request({
        url: url + queryParams,
        method: 'GET'
    }, function (error, response, body) {
        console.log('Status', response.statusCode);
        console.log('Reponse received', body.dutyName);

        return body;
    });
}