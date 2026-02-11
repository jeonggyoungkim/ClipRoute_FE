import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateSignup, type SignupInformation } from "../utils/validate";
import { useAgreement } from "../hooks/useAgreement";
import Header from "../components/common/Header";
import backicon from "../assets/icons/back-icon.svg";
import { signup } from "../api/auth";

type AgeRange =
  | "AGE_10S"
  | "AGE_20S"
  | "AGE_30S"
  | "AGE_40S"
  | "AGE_50S"
  | "AGE_60S_OVER"
  | "UNKNOWN";

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);

  const { values, errors, touched, getInputProps } = useForm<SignupInformation>({
    initialValue: {
      email: "",
      password: "",
      passwordConfirm: "",
      nickname: "",
    },
    validate: validateSignup,
  });

  const [gender, setGender] = useState<"FEMALE" | "MALE" | "OTHER">(
    "FEMALE"
  );
  const [ageRange, setAgeRange] = useState<AgeRange>("AGE_20S");

  const { agreements, handleAllAgree, updateAgreement } = useAgreement();

  const handleNextStep = () => {
    const emailError = errors.email;
    const passwordError = errors.password;
    const passwordConfirmError = errors.passwordConfirm;

    if (!touched.email || !touched.password || !touched.passwordConfirm) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (emailError || passwordError || passwordConfirmError) {
      alert("입력 정보를 다시 확인해주세요.");
      return;
    }

    setStep(2);
  };

  const handleSignup = async () => {
    if (!touched.nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (errors.nickname) {
      alert("닉네임을 다시 확인해주세요.");
      return;
    }

    if (!agreements.terms || !agreements.privacy) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    try {
      await signup({
        email: values.email,
        password: values.password,
        nickname: values.nickname,
        gender,
        ageRange,
      });
      alert("회원가입이 완료되었습니다! 로그인 해주세요.");
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("회원가입에 실패했습니다.");
    }
  };

  const emailProps = getInputProps("email");
  const passwordProps = getInputProps("password");
  const passwordConfirmProps = getInputProps("passwordConfirm");
  const nicknameProps = getInputProps("nickname");

  return (
    <div>
      <Header
        left={
          <button onClick={() => navigate(-1)} aria-label="뒤로가기">
            <img src={backicon} alt="backicon" />
          </button>
        }
      />
      
      <div className="max-w-md mx-auto p-6">
        {/* ===== STEP 1: 회원정보 입력 ===== */}
        {step === 1 && (
          <div className="space-y-6">
            {/* 이메일 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium">이메일</label>
                {touched.email && !errors.email && (
                  <span className="text-blue-500">✓</span>
                )}
              </div>
              <input
                type="email"
                placeholder="이메일을 입력해주세요."
                {...emailProps}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                  touched.email && errors.email
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {touched.email && errors.email && (
                <p className="mt-2 text-sm text-red-500">{errors.email}</p>
              )}
              {touched.email && !errors.email && (
                <p className="mt-2 text-sm text-blue-500">
                  사용 가능한 이메일입니다.
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                비밀번호
              </label>
              <input
                type="password"
                placeholder="비밀번호를 입력해주세요. (조건)"
                {...passwordProps}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                  touched.password && errors.password
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {touched.password && errors.password && (
                <p className="mt-2 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 재확인 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                비밀번호 재확인
              </label>
              <input
                type="password"
                placeholder="비밀번호를 재입력해주세요."
                {...passwordConfirmProps}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                  touched.passwordConfirm && errors.passwordConfirm
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {touched.passwordConfirm && errors.passwordConfirm && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.passwordConfirm}
                </p>
              )}
            </div>

            {/* 다음 버튼 */}
            <button
              onClick={handleNextStep}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition mt-8"
            >
              다음
            </button>
          </div>
        )}

        {/* ===== STEP 2: 추가정보 입력 ===== */}
        {step === 2 && (
          <div className="space-y-6">
            {/* 진행상황 표시 */}
            <div className="bg-blue-500 text-white py-2 px-4 rounded-lg text-center font-medium">
              화면 제작 완료
            </div>

            {/* 닉네임 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium">닉네임</label>
                {touched.nickname && !errors.nickname && (
                  <span className="text-blue-500">✓</span>
                )}
              </div>
              <input
                type="text"
                placeholder="닉네임을 입력해주세요."
                {...nicknameProps}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                  touched.nickname && errors.nickname
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {touched.nickname && errors.nickname && (
                <p className="mt-2 text-sm text-red-500">{errors.nickname}</p>
              )}
            </div>

            {/* 성별 */}
            <div>
              <label className="block text-sm font-medium mb-3">성별</label>
              <div className="flex gap-3">
                {[
                  { label: "남성", value: "MALE" as const },
                  { label: "여성", value: "FEMALE" as const },
                  { label: "기타", value: "OTHER" as const },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setGender(item.value)}
                    className={`flex-1 h-12 rounded-lg border ${
                      gender === item.value
                        ? "border-blue-500 text-black bg-white"
                        : "bg-gray-100 text-gray-400 border-transparent"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 연령 */}
            <div>
              <label className="block text-sm font-medium mb-3">연령</label>
              <div className="flex gap-2">
                {[
                  { label: "10대", value: "AGE_10S" as const },
                  { label: "20대", value: "AGE_20S" as const },
                  { label: "30대", value: "AGE_30S" as const },
                  { label: "40대", value: "AGE_40S" as const },
                  { label: "50대+", value: "AGE_50S" as const },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setAgeRange(item.value)}
                    className={`flex-1 h-10 rounded-md text-xs ${
                      ageRange === item.value
                        ? "bg-white border border-blue-500 text-black"
                        : "bg-gray-100 text-gray-400 border-transparent"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 약관 동의 */}
            <div>
              <label className="block text-sm font-medium mb-4">약관</label>

              {/* 전체 동의 */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                <input
                  type="checkbox"
                  id="all-agree"
                  checked={agreements.all}
                  onChange={(e) => handleAllAgree(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="all-agree" className="font-medium">
                  전체 동의
                </label>
              </div>

              {/* 개별 약관 */}
              <div className="space-y-3">
                {[
                  { key: "terms" as const, label: "[필수] 이용약관 동의" },
                  { key: "privacy" as const, label: "[필수] 개인정보 처리방침 동의" },
                  { key: "email" as const, label: "[선택] 이메일 수신 동의" },
                  { key: "sns" as const, label: "[선택] SNS 수신 동의" },
                  { key: "push" as const, label: "[선택] 앱 푸시 수신 동의" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={item.key}
                      checked={agreements[item.key]}
                      onChange={(e) =>
                        updateAgreement(item.key, e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                    <label htmlFor={item.key} className="text-sm">
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                이전
              </button>
              <button
                onClick={handleSignup}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition"
              >
                회원가입
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}