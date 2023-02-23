const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const baseResponse = require("../../../config/baseResponseStatus");
const { transporter } = require('../../../config/emailSecret');
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const userDao = require("./userDao");
const userProvider = require("./userProvider");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
const res = require("express/lib/response");
require("dotenv").config();

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
            from: process.env.GMAIL_ID,
            to: userEmail,
            subject: "[안다] 이메일을 인증해주세요.",
            html: `
            <!DOCTYPE html>
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Do+Hyeon&family=Jua&family=Nanum+Gothic:wght@400;700;800&family=Nanum+Myeongjo:wght@400;700;800&family=Noto+Sans+KR:wght@300;400&family=Roboto:wght@300;400;500&family=Russo+One&family=Sniglet&display=swap" rel="stylesheet">
            </head>
            <body style="width: 100%;background-color: #dadada;">
                <div class="content" style="width: 98%;margin-left: 1%;margin-right: 1%;margin-top: 8vh;">
                    <div class="headerArea" style="width: 100%;height: 150px;">
                        <div class="logoArea" style="display: flex;justify-content: center;align-items: center;"> 
                            <img src="https://anda-bucket.s3.ap-northeast-2.amazonaws.com/logo.png"> 
                        </div>
                        <div id="mainTitle" style="display: flex;justify-content: center;align-items: center;margin-top: 20px;font-family: 'Jua', sans-serif;font-size: 2em;">
                            안다
                        </div>
                    </div>
            
                    <div class="greetingArea" style="height: auto;width: auto;margin-top: 10px;padding: 30px 20px;background-color: white;border-radius: 10px;">
                        <p id="firstGreeting" style="font-family: 'Noto Sans KR', sans-serif;font-weight: bolder;padding-left: 5%;font-size: 1.3em;width: 90%;">안녕하세요,</p>
                        <p id="contentGreeting" style="font-weight: lighter;line-height: 1.5em;padding-left: 5%;">안다에 가입해주셔서 감사합니다.<br>시작하기 전에, 본인확인을 위해 다음 인증코드를 안다 앱에 입력해주세요:)</p>
                        <div class="btnArea" style="display: flex;justify-content: center;width: 100%;height: 60px;margin-top: 8%;margin-bottom: 8%;">
                            <div id="authenticateBtn" style="display: flex;justify-content: center;align-items: center;background-color: #1CBBD9;border-radius: 15px;width: 200px;height: 100%;font-size: 2em;font-weight: bold;color: white;letter-spacing: 1px;">
                                ${code}
                            </div>
                        </div>
                        <hr id="line" style="width: 100%;color: #999999;size: 1px;">
                        <p id="moreInfo" style="margin-top: 8%;padding-left: 5%;font-weight: lighter;line-height: 1.5em;">
                            <b>도움</b>이 필요하신가요?<br> <b>anda.withu.O.O@gmail.com</b> 로 연락하세요.<br>
                            <b>피드백</b>을 주고 싶으신가요?<br> <b>anda.withu.O.O@gmail.com</b> 로 당신의 생각을 들려주세요.
                        </p>
                    </div>
            
                    
                </div>
            </body>
            
            
            </html>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        // transporter.close();

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

exports.updatePassword = async function (userType, email, password) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        // 비밀번호 암호화
        const hashedPassword = await crypto
        .createHash("sha512")
        .update(password)
        .digest("hex");

        const updatePasswordParams = [userType, email, hashedPassword];
        const updatePasswordResult = await userDao.updatePassword(connection, updatePasswordParams);
        connection.release();

        return response(baseResponse.SUCCESS);
    }
    catch{
        logger.error(`App - findId Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
