// 이메일로 회원 중복 조회
async function selectUserEmail(connection, email) {
    const selectUserEmailQuery = `
                    SELECT COUNT(email) AS userCount
                    FROM User
                    WHERE email = '${email}'
                  `;
    const [emailRows] = await connection.query(selectUserEmailQuery);
    return emailRows;
}

// [의사] 이메일로 회원 중복 조회
async function selectDoctorUserEmail(connection, email) {
  const selectUserEmailQuery = `
                  SELECT COUNT(email) AS userCount
                  FROM DoctorUser
                  WHERE email = '${email}'
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery);
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
      WHERE phone = '${phone}';
    `
  }

  else if(userType == 'doctor'){
    findIdQuery = `
      SELECT email
      FROM DoctorUser
      WHERE phone = '${phone}';
    `
  }

  const [email] = await connection.query(findIdQuery);

  return email;

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
}