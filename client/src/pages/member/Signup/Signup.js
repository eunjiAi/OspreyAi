// src/pages/member/Signup.js
import React, { useEffect, useState } from "react";
import apiClient from "../../../utils/axios";
import style from "./Signup.module.css";

function Signup({ onSignupSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    userNickName: "",
    userPwd: "",
    confirmPwd: "",
    name: "",
    gender: "",
    phone: "",
  });

  // input 의 값을 입력하면 입력된 값으로 formData 의 property 값으로 반영되게 하기 위해
  // 타이핑한 글자가 input 에 보여지게 하는 부분이기도 함
  // 타이핑하는 글자가 input 에 표시되지 않으면 handleChange 와 useState 가 연결되지 않은 오류임(확인 필요)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  // 작성된 이메일 사용 가능 여부에 대한 상태변수 추가함
  const [isIdAvailable, setIsIdAvailable] = useState(null);

  // 이메일 중복검사 버튼 클릭시 작동할 핸들러 함수
  const handleIdCheck = async () => {
    if (!formData.email) {
      alert("이메일을 입력하세요.");
      return;
    }

    try {
      const response = await apiClient.post("/member/emailchk", null, {
        params: { email: formData.email },
      });

      if (response.data === "ok") {
        setIsIdAvailable(true);
        alert("사용 가능한 아이디입니다.");
      } else {
        setIsIdAvailable(false);
        alert("이미 사용중인 아이디입니다. 확인 후 다시 작성하세요.");
      }
    } catch (error) {
      console.error("이메일 중복검사 실패 : ", error);
      alert("중복검사 중 오류가 발생했습니다. 관리자에게 문의하세요.");
    }
  };

  //전송 전에 input 값 유효성 검사 처리
  const validate = () => {
    //암호와 암호 확인이 일치하는지 확인
    if (formData.pw !== formData.confirmPwd) {
      alert("비밀번호가 서로 일치하지 않습니다. 다시 입력해주세요.");
      return false;
    }

    //모든 유효성 검사를 통과하면
    return true;
  };

  // 암호확인 input 의 포커스(focus) 가 사라지면 작동되는 핸들러 함수임
  const handleConfirmPwd = () => {
    if (formData.confirmPwd) {
      validate();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // submit 이벤트 취소함 (axios 로 따로 전송할 것이므로)

    if (isIdAvailable === false) {
      alert("이미 사용중인 이메일입니다.");
      return;
    }

    if (isIdAvailable === null) {
      alert("이메일 중복검사를 해주세요.");
      return;
    }

    // 전송 전에 유효성 검사 확인
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
      <h1>회원 가입</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">아이디: </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={handleIdCheck}>
            중복검사
          </button>
        </div>
        <div>
          <label htmlFor="userPwd">비밀번호: </label>
          <input
            type="password"
            id="userPwd"
            name="pw"
            value={formData.pw}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPwd">비밀번호 확인: </label>
          <input
            type="password"
            id="confirmPwd"
            name="confirmPwd"
            value={formData.confirmPwd}
            onChange={handleChange}
            onBlur={handleConfirmPwd}
            required
          />
        </div>
        <div>
          <label htmlFor="userName">이름: </label>
          <input
            type="text"
            id="userName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="userName">닉네임: </label>
          <input
            type="text"
            id="nickName"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="gender">성별: </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">선택</option>
            <option value="M">남자</option>
            <option value="F">여자</option>
          </select>
        </div>
        <div>
          <label htmlFor="phone">전화번호: </label>
          <input
            type="tel"
            id="phone"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phone">구글: </label>
          <input
            type="email"
            id="google"
            name="google"
            value={formData.google}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">가입하기</button>
      </form>
    </div>
  );
}

export default Signup;
