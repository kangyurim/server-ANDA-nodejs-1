const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const userDao = require("./userDao");
const userProvider = require("./userProvider");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
const res = require("express/lib/response");

exports.emailDuplicateCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  let resultMsg = '';
  connection.release();

  resultTemp = new Object;
  if(emailCheckResult[0].userCount==0) {
    resultTemp.isUsable = true;
    resultTemp.resultMsg = '사용 가능한 이메일입니다.';
  }
  else {
    resultTemp.isUsable = false;
    resultTemp.resultMsg = '이미 가입된 이메일입니다.';
  }

  
  

  return response(baseResponse.SUCCESS, resultTemp);
}

exports.doctorEmailDuplicateCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectDoctorUserEmail(connection, email);

  result = new Object;

  if(emailCheckResult[0].userCount==0) {
    result.isUsable = true;
    result.resultMsg = '사용 가능한 이메일입니다.';
  }
  else{
    result.isUsable = false;
    result.resultMsg = '이미 가입된 이메일입니다.';
  } 
  connection.release();

  return response(baseResponse.SUCCESS, result);
}

exports.nicknameDuplicateCheck = async function (nickname){
  const connection = await pool.getConnection(async (conn) => conn);
  const nicknameCheckResult = await userDao.selectUserNickname(connection, nickname);
  connection.release();
  
  resultTemp = new Object;

  if(nicknameCheckResult[0].userCount==0) {
    resultTemp.isUsable = true;
    resultTemp.resultMsg = '사용 가능한 닉네임입니다.';
  }
  else if(nicknameCheckResult[0].userCount>=1){
    resultTemp.isUsable = false;
    resultTemp.resultMsg = '이미 사용중인 닉네임입니다.';
  } 

  return response(baseResponse.SUCCESS, resultTemp);
}

exports.jwtCheck = async function (token){
  let checkTokenResult = new Object();
    
    checkTokenResult.result = "available";
    checkTokenResult.exp = token.exp;
    checkTokenResult.id = token.id;
    checkTokenResult.email = token.email;
    checkTokenResult.nickname = token.nickname;

    
    return response(baseResponse.SUCCESS, checkTokenResult);
}

//유저 리뷰 조회
exports.userReviewList = async function(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  let response;
  try{
      await connection.beginTransaction();
      const userReviewListResult = await userDao.userRivewList(connection, userId);
      await connection.commit();
      response = userReviewListResult;
  } catch(err){
      await connection.rollback();
      response = errResponse(baseResponse.DB_ERROR);
  } finally{
      connection.release();
      return response;
  }
}