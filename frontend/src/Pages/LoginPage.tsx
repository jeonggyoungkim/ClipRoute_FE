import usericon from "../assets/icons/user-icon.svg";
import passwordicon from "../assets/icons/password-icon.svg";

export default function LoginPage() {
  return (
    <div className="flex flex-col h-full px-8 pt-24 pb-12">
      
      {/* 로고 영역 */}
      <div className="flex justify-center mb-16">
        <h1 className="text-[26px] font-extrabold text-[#42BCEB] tracking-tight">
          ClipRoute
        </h1>
      </div>

      {/* 입력 폼 영역 */}
      <div className="space-y-4 flex-1">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <img src={usericon} alt="usericon"/>
          </span>
          <input 
            type="email" 
            placeholder="이메일" 
            className="w-full h-14 pl-12 pr-4 bg--[#F4F4F4] border-none  focus:ring-2 focus:ring-[#49BEEB] outline-none transition-all placeholder:text-[#F4F4F4]"
          />
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <img src={passwordicon} alt="passwordicon"/>
          </span>
          <input 
            type="password" 
            placeholder="비밀번호" 
            className="w-full h-14 pl-12 pr-12 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-[#49BEEB] outline-none transition-all placeholder:text-gray-400"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">👁️</button>
        </div>

        <div className="flex items-center gap-2 py-2">
          <input 
            type="checkbox" 
            id="keep" 
            className="w-5 h-5 rounded border-gray-300 text-[#49BEEB] focus:ring-[#49BEEB]" 
          />
          <label htmlFor="keep" className="text-sm text-gray-600 font-medium cursor-pointer">
            로그인 상태 유지
          </label>
        </div>
      </div>

      {/* 하단 버튼 및 링크 영역 */}
      <div className="space-y-6">
        <button className="w-full h-14 bg-[#49BEEB] text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-[#3ba8d4] transition-all active:scale-[0.98]">
          로그인
        </button>

        <div className="flex justify-center items-center gap-4 text-[13px] text-gray-500 font-medium">
          <button className="hover:text-gray-800 transition-colors">회원가입</button>
          <span className="w-[1px] h-3 bg-gray-300"></span>
          <button className="hover:text-gray-800 transition-colors">ID 찾기</button>
          <span className="w-[1px] h-3 bg-gray-300"></span>
          <button className="hover:text-gray-800 transition-colors">비밀번호 찾기</button>
        </div>
      </div>

    </div>
  );
}