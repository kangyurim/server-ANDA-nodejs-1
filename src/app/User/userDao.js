// 이메일로 회원 중복 조회
async function selectUserEmail(connection, email) {
    const selectUserEmailQuery = `
                    SELECT COUNT(email) AS userCount
                    FROM User
                    WHERE email = '${email}'
                  `;
    const [emailRows] = await connection.query(selectUserEmailQuery);
    console.log(emailRows[0])
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

module.exports = {
    selectUserEmail,
    selectUserNickname,
    insertUserInfo,
    signinUser,
    saveRefreshToken,
    updateRefreshToken
}