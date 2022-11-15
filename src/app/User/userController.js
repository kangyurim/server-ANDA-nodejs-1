const userService = require("./userService");
const userProvider = require("./userProvider");

const {response} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const baseResponseStatus = require("../../../config/baseResponseStatus");



/**
 * 1. 회원가입 API
 * @param {json} req 
 * @param {json} res 
 */
exports.postUsers = async function (req, res) {
    const {email, password, nickname, recommendUserId} = req.body;

    if(!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    if(!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if(!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));


    const signupUserResponse = await userService.creteUser(
        email,
        password,
        nickname,
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
 * 의사 로그인 API
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 exports.signinDoctorUser = async function (req, res){
    const {email, password} = req.body;

    if(!email)
        return res.send(response.response(baseResponse.SIGNIN_EMAIL_EMPTY))
    if(!password)
        return res.send(response.response(baseResponse.SIGNIN_PASSWORD_EMPTY))

    const signinUserResponse = await userService.signinDoctorUser(
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
    const {email} = req.body;

    const isDuplicateUserResponse = await userProvider.emailDuplicateCheck(email);

    return res.send(isDuplicateUserResponse);    
}

/**
 * 이메일로 중복 의사 유저 확인하기
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 exports.isDuplicateEmailUserDoctor = async function(req, res){
    const {email} = req.body;

    const isDuplicateUserResponse = await userProvider.doctorEmailDuplicateCheck(email);

    return res.send(isDuplicateUserResponse);    
}

/**
 * 닉네임 중복 확인
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.isDuplicateNicknameUser = async function(req, res){
    const {nickname} = req.body;
    
    const isDuplicateUserResponse = await userProvider.nicknameDuplicateCheck(nickname);

    return res.send({isDuplicateUserResponse})
}



/**
 * JWT Token verify
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.jwtCheck = async function(req, res){
    const accessToken = req.verifiedToken;

    if(!accessToken) return res.send(response.response(baseResponse.EMPTY_TOKEN))

    const tokenVerifyRes = await userProvider.jwtCheck(accessToken);
    
    return res.send(tokenVerifyRes);
}

/**
 * 이메일인증하기
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.verifyEmail = async function(req, res){
    const {email, code} = req.body;

    if(!email) return res.send(baseResponse.SIGNUP_EMAIL_EMPTY);

    const emailVerifyRes = await userService.verifyEmail(email, code);

    return res.send(emailVerifyRes);
}

/**
 * 의사 회원가입
 * @param {*} req
 *  @param {*} res
 */
exports.postDoctor = async function(req, res){
    const {nickname, email, password, phone, hospitalName, recommendUserId} = req.body;

    if(!email)
        return res.send(baseResponse.SIGNUP_EMAIL_EMPTY);
    if(!password)
        return res.send(baseResponse.SIGNUP_PASSWORD_EMPTY);
    if(!nickname)
        return res.send(baseResponse.SIGNUP_NICKNAME_EMPTY);
    if(!phone)
        return res.send(baseResponse.SIGNUP_PHONE_EMPTY);
    if(!hospitalName)
        return res.send(baseResponse.SIGNUP_HOSPITALNAME_EMPTY);

    const signupDoctorResponse = await userService.creteDoctorUser(
        nickname, 
        email, 
        password, 
        phone, 
        hospitalName, 
        recommendUserId
    )

    return res.send(signupDoctorResponse);
}
