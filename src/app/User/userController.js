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

exports.isDuplicateUser = async function(req, res){
    const email = req.query.email;

    if(!email)
        return res.send(response.response(baseResponse.SIGNIN_EMAIL_EMPTY));
    
    const isDuplicateUserResponse = await userProvider.emailDuplicateCheck(email);

    return res.send(isDuplicateUserResponse);
    

}