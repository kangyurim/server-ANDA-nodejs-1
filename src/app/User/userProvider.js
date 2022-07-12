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

  console.log(emailCheckResult[0].userCount)

  if(emailCheckResult[0].userCount==0) resultMsg = '사용 가능한 이메일입니다.';
  else resultMsg = '이미 가입된 이메일입니다.';

  return response(baseResponse.SUCCESS, resultMsg);
}