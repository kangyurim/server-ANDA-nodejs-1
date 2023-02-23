module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    // app.get('/app/test', user.getTest)

    // 1. 유저 생성 (회원가입) API
    app.post('/app/users/signup', user.postUsers);

    // 2. 유저 로그인 API
    app.post('/app/users/signin', user.signinUser);

    // 3. 유저 이메일 중복 확인
    app.get('/app/users/signup/verify/email', user.isDuplicateEmailUser);

    // 4. 유저 닉네임 중복 확인
    app.get('/app/users/signup/verify/nickname', user.isDuplicateNicknameUser);

    // 5. JWT 검증
    app.get('/app/users/auto-login', jwtMiddleware, user.jwtCheck);

    // 6. 유저 이메일 인증
    app.post('/app/users/signup/verify/email/code', user.verifyEmail);

    //--------------
    // 1 . 의사 회원가입
    app.post('/app/users/signup/doctor', user.postDoctor);
    // 2. 의사 이메일 중복 확인
    app.get('/app/users/signup/doctor/verify/email', user.isDuplicateEmailUserDoctor);
    // 3. 유저 로그인 API
    app.post('/app/users/signin/doctor', user.signinDoctorUser);
    
    
    
    //----------------
    // 1. 전화번호로 아이디 찾기
    app.post('/app/users/find/id', user.findId);
    // 2. 비밀번호 수정하기
    app.patch('/app/users/find/password', user.updatePassword);

    //---------------
    // 1. 유저 아이디로 리뷰목록 확인하기
    app.post('/app/users/mypage/review', user.getUserReviews);
};