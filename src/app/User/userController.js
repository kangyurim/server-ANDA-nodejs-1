const userService = require("./userService");
const userProvider = require("./userProvider");

const {response} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const { BODY_EMPTY } = require("../../../config/baseResponseStatus");



/**
 * 1. 회원가입 API
 * @param {json} req 
 * @param {json} res 
 */
exports.postUsers = async function (req, res) {
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.send(response(baseResponse.BODY_EMPTY));
      }    
    const {nickname, email, password, recommendUserId} = req.body;

    if(!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));
    if(!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    if(!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    //if(recommendUserId=='null') recommendUserId='NULL';

    const signupUserResponse = await userService.creteUser(
        nickname,
        email,
        password,
        recommendUserId
    )

    return res.send(signupUserResponse);
}

/**
 * 2. 로그인 API
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.signinUser = async function (req, res){
    const {email, password} = req.body;

    if(!email)
        return res.send(response.response(baseResponse.SIGNIN_EMAIL_EMPTY))
    if(!password)
        return res.send(response.response(baseResponse.SIGNIN_PASSWORD_EMPTY))

    const signinUserResponse = await userService.signinUser(
        email,
        password
    ) 

    return res.send(signinUserResponse);
}

/**
 * 이메일로 중복 유저 확인하기
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.isDuplicateEmailUser = async function(req, res){
    const email = req.params.email;

    console.log(email)
    const isDuplicateUserResponse = await userProvider.emailDuplicateCheck(email);

    return res.send(isDuplicateUserResponse);    
}

exports.isDuplicateNicknameUser = async function(req, res){
    const nickname = req.params.nickname;

    const isDuplicateUserResponse = await userProvider.nicknameDuplicateCheck(nickname);

    return res.send(isDuplicateUserResponse);
}