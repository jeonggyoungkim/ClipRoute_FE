export type UserSingInformation = {
  email: string;
  password: string;
};

// 로그인 검증 함수
// 회원가입 검증 함수는 화면 제작 시 추가 **
function validateUser(values: UserSingInformation) {
  const errors = {
    email: "",
    password: "",
  };

  if (!values.email){
    errors.email = "이메일을 입력해주세요.";
  }
  else if (
     !/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(values.email,)
  )
  {
    errors.email = "올바른 이메일 형식이 아닙니다.";
  }

  if(!values.password){
    errors.password = "비밀번호를 입력해주세요.";
  }
  else if(!(values.password.length >= 8 && values.password.length <= 20)){
    errors.password = "비밀번호는 8~20자 사이로 입력해주세요.";
  }

  return errors;
}

function validateSignin(values: UserSingInformation) {
  return validateUser(values);
}

export{ validateSignin };