import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateSignup, type SignupInformation } from "../utils/validate";

export default function SignupPage() {
  const navigate = useNavigate();

 
  const { values, errors, touched, getInputProps } = useForm<SignupInformation>({
    initialValue: {
      email: "",
      password: "",
      passwordConfirm: "",
      nickname: "",
    },
    validate: validateSignup,
  });

  const handleSignup = () => {
    const noErrors = !Object.values(errors).some(error => error !== "");
    if (noErrors && values.email && values.password) {
      console.log("회원가입 데이터:", values);
      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } else {
      alert("입력 정보를 다시 확인해주세요.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-6 pt-12 pb-8">
      {/* 헤더 */}
      <div className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="mr-4">
          <span className="text-2xl">o</span>
        </button>
        <h2 className="text-xl font-bold">회원가입</h2>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto">
      
        <section className="space-y-4">
           <div>
            <label className="block text-sm font-bold mb-2">이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력해주세요."
              {...getInputProps("email")}
              className="w-full h-12 px-4 bg-[#F4F4F4] rounded-lg outline-none focus:ring-2 focus:ring-[#42BCEB]"
            />
            {touched.email && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요."
              {...getInputProps("password")}
              className="w-full h-12 px-4 bg-[#F4F4F4] rounded-lg outline-none focus:ring-2 focus:ring-[#42BCEB]"
            />
          </div>
        </section>

       
        <section>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1">
              <label className="text-sm font-bold">닉네임</label>
              
            </div>
      
          </div>
          <input
            type="text"
            placeholder="닉네임을 입력해주세요."
            {...getInputProps("nickname")}
            className="w-full h-12 px-4 border border-[#42BCEB] rounded-lg outline-none"
          />
        </section>

        
        <section>
          <div className="flex items-center gap-1 mb-3">
            <label className="text-sm font-bold">성별</label>
            
          </div>
          <div className="flex gap-2">
            {["남성", "여성", "기타"].map((gender) => (
              <button
                key={gender}
                className={`flex-1 h-12 rounded-lg text-sm border ${
                  gender === "남성" ? "border-[#42BCEB] text-black" : "border-none bg-[#F4F4F4] text-gray-500"
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </section>

       
        <section>
          <div className="flex items-center gap-1 mb-3">
            <label className="text-sm font-bold">연령</label>
           
          </div>
          <div className="flex bg-[#F4F4F4] rounded-lg p-1">
            {["10대", "20대", "30대", "40대", "50대+"].map((age) => (
              <button
                key={age}
                className={`flex-1 h-10 rounded-md text-xs font-medium ${
                  age === "10대" ? "bg-white border border-[#42BCEB] shadow-sm" : "text-gray-400"
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </section>

      
        <section className="pt-4 border-t border-gray-100 space-y-4">
          <div className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
            <span className="text-sm font-bold">전체 동의</span>
          </div>
          <div className="space-y-3 pl-1">
            {[ 
              { label: "[필수] 이용약관 동의", required: true },
              { label: "[필수] 개인 정보 처리방침 동의", required: true },
              { label: "[선택] 이메일 수신 동의", required: false },
              { label: "[선택] SNS 수신 동의", required: false },
              { label: "[선택] 이벤트 앱 푸시 수신 동의", required: false },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 border-gray-300" />
                  <span>{item.label}</span>
                </div>
                <button className="text-[10px] underline text-gray-400">보기</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 하단 가입 버튼 */}
      <div className="mt-8">
        <button
          onClick={handleSignup}
          className="w-full h-14 bg-[#42BCEB] text-white text-lg font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}