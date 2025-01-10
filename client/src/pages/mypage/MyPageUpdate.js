import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import styles from "./MyPageUpdate.css";
import { AuthContext } from "../../AuthProvider";

function MyPageUpdate() {
  const { uuid, userid, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    memberid: "",
    phoneNumber: "",
    gender: "",
    google: "",
    naver: "",
    kakao: "",
    faceId: "", // Face ID 상태 추가
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/member/mypage/${userid}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setFormData({
          memberid: response.data.memberid,
          name: response.data.name,
          nickname: response.data.nickname,
          phoneNumber: response.data.phoneNumber,
          gender: response.data.gender,
          google: response.data.google,
          naver: response.data.naver,
          kakao: response.data.kakao,
          faceId: response.data.faceId, // Face ID 값 가져오기
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("회원 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userid, accessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await apiClient.put(`/member/mypage/${uuid}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("회원 정보가 성공적으로 수정되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error("Error updating user data:", err);
      alert("회원 정보 수정에 실패했습니다.");
    }
  };

  const handleDeleteFaceID = async () => {
    try {
      await apiClient.post(
        "http://localhost:5001/delete-faceid",
        { uuid },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Face ID가 성공적으로 삭제되었습니다.");
      setFormData({ ...formData, faceId: "" }); // Face ID 초기화
    } catch (err) {
      console.error("Error deleting Face ID:", err);
      alert("Face ID 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className="mypage-edit-container">
      <h1 className="mypage-edit-title">회원정보 수정</h1>
      <form className="edit-form">
        <label>
          이름*:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          닉네임:
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
          />
        </label>
        <label>
          전화번호:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </label>

        <p>이메일 연동</p>
        <label>
          구글:
          <input
            type="text"
            name="google"
            value={formData.google}
            onChange={handleInputChange}
          />
        </label>
        <label>
          네이버:
          <input
            type="text"
            name="naver"
            value={formData.naver}
            onChange={handleInputChange}
          />
        </label>
        <label>
          카카오:
          <input
            type="text"
            name="kakao"
            value={formData.kakao}
            onChange={handleInputChange}
          />
        </label>

        {/* Face ID 등록/삭제 버튼 조건부 렌더링 */}
        {formData.faceId ? (
          <button
            type="button"
            onClick={handleDeleteFaceID}
            className="delete-faceid-btn"
          >
            Face ID 삭제
          </button>
        ) : (
          <button
            type="button"
            className="faceid-register-btn"
            onClick={() => navigate("/FaceIdRegister")}
          >
            Face ID 등록
          </button>
        )}

        <button type="button" onClick={handleSave} className="save-btn">
          저장
        </button>
      </form>
    </div>
  );
}

export default MyPageUpdate;
