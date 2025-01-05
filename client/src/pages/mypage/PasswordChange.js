import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import "./PasswordChange.css";
import { AuthContext } from "../../AuthProvider";

function PasswordChange() {
  const { uuid, userid, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get(`/member/mypage/${userid}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        alert("사용자 정보를 불러오는 중 문제가 발생했습니다.");
      }
    };

    fetchUserData();
  }, [userid, accessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const validatePasswords = () => {
    if (!passwordData.currentPassword) {
      alert("현재 비밀번호를 입력하세요.");
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("새로운 비밀번호가 서로 일치하지 않습니다.");
      return false;
    }
    return true;
  };

  const handlePasswordChange = async () => {
    if (!validatePasswords()) return;

    if (!userData) {
      alert("사용자 정보를 불러오는 중 문제가 발생했습니다.");
      return;
    }

    try {
      // 현재 비밀번호 확인
      const checkResponse = await apiClient.post(
        `/member/mypage/chkpw/${userid}`,
        { pw: passwordData.currentPassword },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (checkResponse.status === 401) {
        alert("현재 비밀번호가 일치하지 않습니다.");
        return;
      }

      // 새 비밀번호 업데이트 요청
      const updatedData = {
        ...userData,
        pw: passwordData.newPassword,
      };

      const updateResponse = await apiClient.put(
        `/member/mypage/pwchange/${uuid}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (updateResponse.status === 200) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        navigate("/mypage");
      } else {
        throw new Error("비밀번호 변경 요청 실패");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("현재 비밀번호가 일치하지 않습니다.");
      } else {
        console.error("Error changing password:", err);
        alert("비밀번호 변경에 실패했습니다.");
      }
    }
  };


  return (
    <div className="password-change-container">
      <h1 className="password-change-title">비밀번호 변경</h1>
      <form className="password-change-form">
        <label>
          현재 비밀번호:
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          새 비밀번호:
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          새 비밀번호 확인:
          <input
            type="password"
            name="confirmNewPassword"
            value={passwordData.confirmNewPassword}
            onChange={handleInputChange}
            required
          />
        </label>

        <button
          type="button"
          onClick={handlePasswordChange}
          className="save-btn"
        >
          변경
        </button>
      </form>
    </div>
  );
}

export default PasswordChange;
