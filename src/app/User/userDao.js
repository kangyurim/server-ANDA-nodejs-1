// 이메일로 회원 중복 조회
async function selectUserEmail(connection, email) {
    const selectUserEmailQuery = `
                    SELECT COUNT(email) AS userCount
                    FROM User
                    WHERE email = ?
                  `;
    const [emailRows] = await connection.query(selectUserEmailQuery, email);
    return emailRows;
}

// [의사] 이메일로 회원 중복 조회
async function selectDoctorUserEmail(connection, email) {
  const selectUserEmailQuery = `
                  SELECT COUNT(email) AS userCount
                  FROM DoctorUser
                  WHERE email = ?
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

//닉네임으로 회원 중복 조회
async function selectUserNickname(connection, nickname){
  const selectUserNicknameQuery = `
                    SELECT COUNT(nickname) AS userCount
                    FROM User
                    WHERE nickname = ?
                  `;
  const [nicknameRows] = await connection.query(selectUserNicknameQuery, nickname);
  return nicknameRows;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
    const insertUserInfoQuery = `
    insert into User(email, password, nickname, recommendUserId)
    VALUES(?, ?, ?, ?);
      `;
    const insertUserInfoRow = await connection.query(
      insertUserInfoQuery,
      insertUserInfoParams
    );
  
    return insertUserInfoRow;
}

//유저 로그인
async function signinUser(connection, signinUserParams){
  const signinUserQuery =`
    SELECT id, createdAt, updatedAt, nickname, name, email, recommendUserId
    FROM User
    WHERE email = ? AND password = ? AND status='Activated';;
  `
  const signinUserRow = await connection.query(
    signinUserQuery,
    signinUserParams
  )

  return signinUserRow[0][0];
}
//[의사]유저 로그인
async function signinDoctorUser(connection, signinUserParams){
  const signinUserQuery =`
    SELECT id, createdAt, updatedAt, nickname, name, email, recommendUserId
    FROM DoctorUser
    WHERE email = ? AND password = ? AND status='Activated';;
  `
  const signinUserRow = await connection.query(
    signinUserQuery,
    signinUserParams
  )

  return signinUserRow[0][0];
}

//Refresh Token 저장
async function saveRefreshToken(connection, refreshTokenParams){
  const refreshTokenQuery = `
    insert into RefreshToken (email, refreshToken) VALUES (?, ?)
  `
  
  connection.query(
    refreshTokenQuery,
    refreshTokenParams,
    function (err, result) {
      if (err) throw err;
      
      console.log(`${result.affectedRows}개의 Refresh Token 추가됨.`);
    });

  return 1;
}

//Refresh Token 업데이트
async function updateRefreshToken(connection, refreshTokenParams){
  const refreshTokenQuery = `
    UPDATE RefreshToken SET refreshToken = ? WHERE email = ?
  `
  
  connection.query(
    refreshTokenQuery,
    refreshTokenParams,
    function (err, result) {
      if (err) throw err;
      
      console.log(`${result.affectedRows}개의 Refresh Token 추가됨.`);
    });

  return 1;
}

//의사 유저 생성
async function insertDoctorUserInfo(connection, InsertDocotUserParams){
  const doctorUserCreateQuery = `
    insert into DoctorUser(nickname, email, password, phone, hospitalName, recommendUserId)
    VALUES(?, ?, ?, ?, ?, ?);
  `
  const doctorUserCreateRow = await connection.query(
    doctorUserCreateQuery,
    InsertDocotUserParams
  );

  return doctorUserCreateRow;
}

//핸드폰 번호로 ID 찾기
async function findId(connection, phone, userType){
  let findIdQuery = '';
  if(userType == 'user'){
    findIdQuery = `
      SELECT email
      FROM User
      WHERE phone = ?;
    `
  }

  else if(userType == 'doctor'){
    findIdQuery = `
      SELECT email
      FROM DoctorUser
      WHERE phone = ?;
    `
  }

  const [email] = await connection.query(findIdQuery, phone);

  return email;
}

//비밀번호 수정하기
async function updatePassword(connection, updatePasswordParams){
  const [userType, email, hashedPassword] = updatePasswordParams;
  let updatePasswordQuery = '';
  if(userType == 'user'){
  updatePasswordQuery = `
    UPDATE User SET password = ? WHERE email = ?;
    `
  }
  else if(userType == 'doctor'){
    updatePasswordQuery = `
    UPDATE DoctorUser SET password = ? WHERE email = ?;
    `
  }
  const updatePasswordRow = await connection.query(
    updatePasswordQuery,
    [hashedPassword, email]
  );
  
  return updatePasswordRow;
}

// 유저 리뷰 조회
async function userRivewList(connection, userId) {
  let fianlUserReviewList = new Object();
  
  const userLasicReview = `
    SELECT U.id, U.nickname, O.id AS hospitalName, cityName, townName, address, reviewText, friendlyScore, waitScore, priceScore, infoScore, recommendScore
    FROM Ophthalmology AS O
    INNER JOIN LasicReview Reivew on O.id = Reivew.ophthalmologyId
    INNER JOIN User U on Reivew.userId = U.id
    WHERE Reivew.status = 'Activated' AND U.id = ?
    ORDER BY Reivew.createdAt DESC
  `;
  const lasicReviewRow = await connection.query(userLasicReview, userId);
  fianlUserReviewList.userLasicReview = lasicReviewRow[0];

  const userLasecReview = `
      SELECT U.id, U.nickname, O.id AS hospitalName, cityName, townName, address, reviewText, friendlyScore, waitScore, priceScore, infoScore, recommendScore
      FROM Ophthalmology AS O
      INNER JOIN LasecReview Reivew on O.id = Reivew.ophthalmologyId
      INNER JOIN User U on Reivew.userId = U.id
      WHERE Reivew.status = 'Activated' AND U.id = ?
      ORDER BY Reivew.createdAt DESC
  `
  const lasecReviewRow = await connection.query(userLasecReview, userId);
  fianlUserReviewList.userLasecReview = lasecReviewRow[0];
 
  const userLensInsertReview = `
      SELECT U.id, U.nickname, O.id AS hospitalName, cityName, townName, address, reviewText, friendlyScore, waitScore, priceScore, infoScore, recommendScore
      FROM Ophthalmology AS O
      INNER JOIN LensInsertReview Reivew on O.id = Reivew.ophthalmologyId
      INNER JOIN User U on Reivew.userId = U.id
      WHERE Reivew.status = 'Activated' AND U.id = ?
      ORDER BY Reivew.createdAt DESC
  `
  const lensInsertReviewRow = await connection.query(userLensInsertReview, userId);
  fianlUserReviewList.userLensInsertReview = lensInsertReviewRow[0];

  const userSmileLasicReview = `
      SELECT U.id, U.nickname, O.id AS hospitalName, cityName, townName, address, reviewText, friendlyScore, waitScore, priceScore, infoScore, recommendScore
      FROM Ophthalmology AS O
      INNER JOIN LensInsertReview Reivew on O.id = Reivew.ophthalmologyId
      INNER JOIN User U on Reivew.userId = U.id
      WHERE Reivew.status = 'Activated' AND U.id = ?
      ORDER BY Reivew.createdAt DESC
  `
  const smileLasicReviewRow = await connection.query(userSmileLasicReview, userId);
  fianlUserReviewList.userSmileLasicReview = smileLasicReviewRow[0];

  const userCataractReview = `
      SELECT U.id, U.nickname, O.id AS hospitalName, cityName, townName, address, reviewText, friendlyScore, waitScore, priceScore, infoScore, recommendScore
      FROM Ophthalmology AS O
      INNER JOIN CataractReview Reivew on O.id = Reivew.ophthalmologyId
      INNER JOIN User U on Reivew.userId = U.id
      WHERE Reivew.status = 'Activated' AND U.id = ?
      ORDER BY Reivew.createdAt DESC
  `
  const cataractReviewRow = await connection.query(userCataractReview, userId);
  fianlUserReviewList.userCataractReview = cataractReviewRow[0];

  const userDiagnosisReview = `
      SELECT U.id, U.nickname, O.id AS hospitalName, cityName, townName, address, reviewText, friendlyScore, waitScore, priceScore, infoScore, recommendScore
      FROM Ophthalmology AS O
      INNER JOIN diagnosisReview Reivew on O.id = Reivew.ophthalmologyId
      INNER JOIN User U on Reivew.userId = U.id
      WHERE Reivew.status = 'Activated' AND U.id = ?
      ORDER BY Reivew.createdAt DESC
  `
  const diagnosisReviewRow = await connection.query(userDiagnosisReview, userId);
  fianlUserReviewList.userDiagnosisReview = diagnosisReviewRow[0];


  return fianlUserReviewList;
}



module.exports = {
    selectUserEmail,
    selectUserNickname,
    insertUserInfo,
    signinUser,
    saveRefreshToken,
    updateRefreshToken,
    insertDoctorUserInfo,
    selectDoctorUserEmail,
    signinDoctorUser,
    findId,
    updatePassword,
    userRivewList
}