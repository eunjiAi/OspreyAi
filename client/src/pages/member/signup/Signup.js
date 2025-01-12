import React, { useState } from "react";
import apiClient from "../../../utils/axios";
import style from "./Signup.module.css";

function Signup({ onSignupSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [userInputCode, setUserInputCode] = useState("");
  const [formData, setFormData] = useState({
    memberId: "",
    pw: "",
    confirmPwd: "",
    email: "",
    name: "",
    nickname: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIdCheck = async () => {
    if (!formData.memberId) {
      alert("아이디를 입력하세요.");
      return;
    }

    try {
      const response = await apiClient.post("/member/memberidchk", null, {
        params: { memberId: formData.memberId },
      });

      if (response.data === "ok") {
        setIsIdAvailable(true);
        alert("사용 가능한 아이디입니다.");
      } else {
        setIsIdAvailable(false);
        alert("이미 사용 중인 아이디입니다. 다른 아이디를 사용하세요.");
      }
    } catch (error) {
      console.error("아이디 중복 검사 실패: ", error);
      alert("중복 검사 중 오류가 발생했습니다. 관리자에게 문의하세요.");
    }
  };

  const handleSendEmail = async () => {
    if (!formData.email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setIsConfirm(true);
    try {
      const response = await apiClient.post("/member/emailCheck", {
        email: formData.email,
      });

      setEmailCode(response.data.code);
      alert("인증 코드가 이메일로 전송되었습니다.");
    } catch (error) {
      console.error(error);
      alert("인증 코드 전송 실패. 다시 시도해주세요.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const handleVerifyCode = () => {
    if (userInputCode === emailCode) {
      setIsEmailVerified(true);
      alert("이메일 인증이 완료되었습니다.");
    } else {
      alert("인증 코드가 일치하지 않습니다. 다시 확인해주세요.");
    }
  };

  const validate = () => {
    if (formData.pw !== formData.confirmPwd) {
      alert("비밀번호가 서로 일치하지 않습니다.");
      return false;
    }
    if (!formData.pw || formData.pw.length < 4) {
      alert("비밀번호를 4자 이상 작성해 주세요");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isIdAvailable) {
      alert("아이디 중복 검사를 완료해주세요.");
      return;
    }

    if (!isEmailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (!validate()) {
      return;
    }

    //전송보낼 FormData 객체 생성함
    const combinedFormData = new FormData();
    //input 의 값들과 첨부파일을 append 처리함
    Object.keys(formData).forEach((key) => {
      combinedFormData.append(key, formData[key]);
    });

    try {
      // 서버측으로 회원가입 요청
      const response = await apiClient.post("/member", combinedFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        alert("회원가입이 완료되었습니다.");
        onSignupSuccess(); // Header.js 의 onSignupSuccess={handleSignupSuccess} 속성이 작동됨
      }
    } catch (error) {
      console.error("회원가입 실패 : ", error);
      alert("회원 가입에 실패했습니다. 다시 시도해 주세요");
    }
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>회원 가입</h1>
      <form className={style.form} onSubmit={handleSubmit}>
        <div className={style.field}>
          <label htmlFor="memberId" className={style.label}>
            아이디:
          </label>
          <div className={style.inlineGroup}>
            <input
              type="text"
              id="memberId"
              name="memberId"
              className={style.inlineInput}
              value={formData.memberId}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className={style.inlineButton}
              onClick={handleIdCheck}
            >
              중복검사
            </button>
          </div>
        </div>
        <div className={style.field}>
          <label htmlFor="pw" className={style.label}>
            비밀번호:
          </label>
          <input
            type="password"
            id="pw"
            name="pw"
            className={style.input}
            value={formData.pw}
            onChange={handleChange}
            required
          />
        </div>
        <div className={style.field}>
          <label htmlFor="confirmPwd" className={style.label}>
            비밀번호 확인:
          </label>
          <input
            type="password"
            id="confirmPwd"
            name="confirmPwd"
            className={style.input}
            value={formData.confirmPwd}
            onChange={handleChange}
            required
          />
        </div>
        <div className={style.field}>
          <label htmlFor="email" className={style.label}>
            이메일:
          </label>
          <div className={style.inlineGroup}>
            <input
              type="email"
              id="email"
              name="email"
              className={style.inlineInput}
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading || isEmailVerified || isConfirm}
            />
            <button
              type="button"
              className={style.inlineButton}
              onClick={handleSendEmail}
              disabled={isLoading || isEmailVerified}
            >
              {isLoading ? "전송 중..." : "인증하기"}
            </button>
          </div>
        </div>
        <div className={style.field}>
          <label htmlFor="emailCode" className={style.label}>
            인증 코드:
          </label>
          <div className={style.inlineGroup}>
            <input
              type="text"
              id="emailCode"
              name="emailCode"
              className={style.inlineInput}
              value={userInputCode}
              onChange={(e) => setUserInputCode(e.target.value)}
              required
              disabled={isEmailVerified}
            />
            <button
              type="button"
              className={style.inlineButton}
              onClick={handleVerifyCode}
              disabled={isEmailVerified}
            >
              인증 확인
            </button>
          </div>
          {isEmailVerified && (
            <p className={style.successMessage}>
              이메일 인증이 완료되었습니다.
            </p>
          )}
        </div>
        <div className={style.field}>
          <label htmlFor="name" className={style.label}>
            이름:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={style.input}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={style.field}>
          <label htmlFor="nickname" className={style.label}>
            닉네임:
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            className={style.input}
            value={formData.nickname}
            onChange={handleChange}
            required
          />
        </div>
        <div className={style.field}>
          <label htmlFor="gender" className={style.label}>
            성별:
          </label>
          <select
            id="gender"
            name="gender"
            style={{ width: 372 }}
            className={style.select}
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">선택</option>
            <option value="M">남자</option>
            <option value="F">여자</option>
          </select>
        </div>
        <button type="submit" className={style.submitButton}>
          가입하기
        </button>
      </form>
    </div>
  );
}

export default Signup;
