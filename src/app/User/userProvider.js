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

  if(emailCheckResult[0].userCount==0) resultMsg = '사용 가능한 이메일입니다.';
  else resultMsg = '이미 가입된 이메일입니다.';

  return response(baseResponse.SUCCESS, resultMsg);
}

exports.nicknameDuplicateCheck = async function (nickname){
  const connection = await pool.getConnection(async (conn) => conn);
  const nicknameCheckResult = await userDao.selectUserNickname(connection, nickname);
  let resultMsg = '';
  connection.release();

  if(nicknameCheckResult[0].userCount==0) resultMsg = '사용 가능한 닉네임입니다.';
  else resultMsg = '이미 사용중인 닉네임입니다.';

  return response(baseResponse.SUCCESS, resultMsg);
}

exports.jwtCheck = async function (token){
  let checkTokenResult = new Object();
    
    checkTokenResult.result = "available";
    checkTokenResult.exp = token.exp;
    checkTokenResult.id = token.id;
    checkTokenResult.email = token.email;
    checkTokenResult.nickname = token.nickname;
    console.log(checkTokenResult);
    
    return response(baseResponse.SUCCESS, checkTokenResult);
}