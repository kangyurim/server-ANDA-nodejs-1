const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const baseResponse = require("../../../config/baseResponseStatus");
const { smtpTransport } = require('../../../config/emailSecret');
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const userDao = require("./userDao");
const userProvider = require("./userProvider");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
const res = require("express/lib/response");

/**
 * 회원가입 API
 * @param {*} name 
 * @param {*} email 
 * @param {*} password 
 * @param {*} nickname
 * @param {*} member 
 * @param {*} generation 
 * @returns 
 */
exports.creteUser = async function (email, password, nickname, recommendUserId){

    const isEmailDuplicated = await userProvider.emailDuplicateCheck(email);
    try{
        if(isEmailDuplicated.result == '이미 가입된 이메일입니다.'){//이메일 중복이 있는 경우
            return errResponse(baseResponse.SIGNUP_EMAIL_DUPLICATED);
        }

         // 비밀번호 암호화
         const hashedPassword = await crypto
         .createHash("sha512")
         .update(password)
         .digest("hex");

         const insertUserParams = [email, hashedPassword, nickname, recommendUserId];

         const connection = await pool.getConnection(async (conn) => conn);
         const userCreateResult = await userDao.insertUserInfo(connection, insertUserParams);
        
         connection.release();
         return response(baseResponse.SUCCESS, {'email': email});
    }
    catch{
        //logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
    
}
/**
 * 의사 유저 생성 API
 * @param {*} nickname 
 * @param {*} email 
 * @param {*} password 
 * @param {*} phone 
 * @param {*} hospitalName 
 * @param {*} recommendUserId 
 * @returns 
 */
exports.creteDoctorUser = async function (nickname, email, password, phone, hospitalName, recommendUserId){
    try{
        //비밀번호 암호화
        const hashedPassword = await crypto
        .createHash("sha512")
        .update(password)
        .digest("hex");
        
        const InsertDocotUserParams = [nickname, email, hashedPassword, phone, hospitalName, recommendUserId];
        const connection = await pool.getConnection(async (conn) => conn);
        const doctorUserCreateResult = await userDao.insertDoctorUserInfo(connection, InsertDocotUserParams);

        connection.release();
        return response(baseResponse.SUCCESS, {'email': email});
    }
    catch{
        return errResponse(baseResponse.DB_ERROR);
    }
}

/**
 * 로그인 API
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
exports.signinUser = async function (email, password)
{
    try{
         // 비밀번호 암호화
         const hashedPassword = await crypto
         .createHash("sha512")
         .update(password)
         .digest("hex");

         const signinUserParams = [email, hashedPassword];

         const connection = await pool.getConnection(async (conn) => conn);
         const userSignInResult = await userDao.signinUser(connection, signinUserParams); 
         
         if(userSignInResult != null)
         {
             //토큰 생성 Service
            let AccessToken = await jwt.sign(
                {
                    id: userSignInResult.id,
                    createAt: userSignInResult.createdAt,
                    nickname: userSignInResult.nickname,
                    email: userSignInResult.email,
                    recommendUserId: userSignInResult.recommendUserId
                }, // 토큰의 내용(payload)
                secret_config.ACCESSjwtsecret, // 비밀키
                {
                    expiresIn: "3h",
                    subject: "userInfo",
                } // 유효 기간 3시간
            );

            let RefreshToken = await jwt.sign(
                {
                    id: userSignInResult.id,
                    createAt: userSignInResult.createdAt,
                    nickName: userSignInResult.nickName,
                    email: userSignInResult.email,
                    recommendUserId: userSignInResult.recommendUserId
                }, // 토큰의 내용(payload)
                secret_config.REFRESHjwtsecret, // 비밀키
                {
                    expiresIn: "2w",
                    subject: "userInfo",
                } // 유효 기간 2주
            );

            const refreshTokenParams = [RefreshToken, email]
            const refreshTokenSaveResult = await userDao.updateRefreshToken(connection, refreshTokenParams)

            connection.release();
            return response(baseResponse.SUCCESS, {'email': email, 
                                                   'AccessJWT': AccessToken,
                                                    'RefreshJWT': RefreshToken});
        }
        else return errResponse(baseResponse.SIGNIN_FAILED);
    }
    catch{
        logger.error(`App - signIn Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

/**
 * 의사 로그인 API
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
 exports.signinDoctorUser = async function (email, password)
 {
     try{
          // 비밀번호 암호화
          const hashedPassword = await crypto
          .createHash("sha512")
          .update(password)
          .digest("hex");
 
          const signinUserParams = [email, hashedPassword];
 
          const connection = await pool.getConnection(async (conn) => conn);
          const userSignInResult = await userDao.signinDoctorUser(connection, signinUserParams); 
          
          if(userSignInResult != null)
          {
              //토큰 생성 Service
             let AccessToken = await jwt.sign(
                 {
                     id: userSignInResult.id,
                     createAt: userSignInResult.createdAt,
                     nickname: userSignInResult.nickname,
                     email: userSignInResult.email,
                     recommendUserId: userSignInResult.recommendUserId
                 }, // 토큰의 내용(payload)
                 secret_config.ACCESSjwtsecret, // 비밀키
                 {
                     expiresIn: "3h",
                     subject: "userInfo",
                 } // 유효 기간 3시간
             );
 
             let RefreshToken = await jwt.sign(
                 {
                     id: userSignInResult.id,
                     createAt: userSignInResult.createdAt,
                     nickName: userSignInResult.nickName,
                     email: userSignInResult.email,
                     recommendUserId: userSignInResult.recommendUserId
                 }, // 토큰의 내용(payload)
                 secret_config.REFRESHjwtsecret, // 비밀키
                 {
                     expiresIn: "2w",
                     subject: "userInfo",
                 } // 유효 기간 2주
             );
 
             const refreshTokenParams = [RefreshToken, email]
             const refreshTokenSaveResult = await userDao.updateRefreshToken(connection, refreshTokenParams)
 
             connection.release();
             return response(baseResponse.SUCCESS, {'email': email, 
                                                    'AccessJWT': AccessToken,
                                                     'RefreshJWT': RefreshToken});
         }
         else return errResponse(baseResponse.SIGNIN_FAILED);
     }
     catch{
         logger.error(`App - signIn Service error\n: ${err.message}`);
         return errResponse(baseResponse.DB_ERROR);
     }
 }

/**
 * 이메일 인증하기
 * @param {*} userEmail 
 * @returns 
 */

exports.verifyEmail = async function(userEmail, code){
        const mailOptions = {
            from: "안다",
            to: userEmail,
            subject: "[안다] 이메일을 인증해주세요.",
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
            </head>
            <body>
                <div class="content" style="width: 60%; margin-left:20%; margin-right:20%;">
                    <h1>이메일을 인증해주세요.</h1>
                    <p style="font-size:1.3em; margin-top: 10px;">다음 인증코드를 안다 앱에 입력해주세요.</p>
                    <div class="box" style="width: 40%; height: 10vh; background-color: rgba(0, 0, 0, 0.3); margin-top:20px; border-radius: 10px; 
                                            text-align: center; line-height: 10vh; color: white;  font-size: 2em; font-weight: 600;">
                        ${code}
                    </div>
                </div>
            </body>
            </html>
            `
        };

        const result = await smtpTransport.sendMail(mailOptions, (error, responses) =>{
            if(error){
                return "mail send Failed"
            }else{
                return"SUCCESS"
            }
        });
        smtpTransport.close();

    return response(baseResponse.SUCCESS, result);
}

/**
 * 폰번호로 아이디 가져오기.
 * @param {*} phone 
 * @param {*} userType 
 * @returns 
 */
exports.findId = async function (phone, userType) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const findIdResult = await userDao.findId(connection, phone, userType);
        connection.release();

        if(findIdResult.length > 0) return response(baseResponse.SUCCESS, findIdResult);
        if(findIdResult.length == 0) return response(baseResponse.USER_ID_NOT_EXIST);
    } catch (err) {
        logger.error(`App - findId Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}