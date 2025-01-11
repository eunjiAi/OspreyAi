import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import styles from "./MyPageUpdate.module.css";
import { AuthContext } from "../../AuthProvider";

function MyPageUpdate() {
  const { uuid, userid, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    memberid: "",
    phoneNumber: "",
    gender: "",
    google: "",
    naver: "",
    kakao: "",
    faceId: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModified, setIsModified] = useState(false); // 값이 변경되었는지 확인하는 상태

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/member/mypage/${userid}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setInitialData(response.data);
        setFormData({
          memberid: response.data.memberid,
          name: response.data.name,
          nickname: response.data.nickname,
          phoneNumber: response.data.phoneNumber,
          gender: response.data.gender,
          google: response.data.google,
          naver: response.data.naver,
          kakao: response.data.kakao,
          faceId: response.data.faceId,
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

  // 값 변경 상태 확인
  useEffect(() => {
    setIsModified(JSON.stringify(initialData) !== JSON.stringify(formData));
  }, [formData, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleKeyPress = () => {
    // 키 입력이 발생하면 저장 버튼 활성화
    setIsModified(true);
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
      setFormData({ ...formData, faceId: "" });
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
    <div className={styles.mypageEditContainer}>
      <h1 className={styles.mypageEditTitle}>회원정보 수정</h1>
      <form className={styles.editForm}>
        <label className={styles.editFormLabel}>
          이름*:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className={styles.editFormInput}
            required
          />
        </label>
        <label className={styles.editFormLabel}>
          닉네임:
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className={styles.editFormInput}
          />
        </label>
        <label className={styles.editFormLabel}>
          전화번호:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className={styles.editFormInput}
          />
        </label>
        <label className={styles.editFormLabel}>
          성별:
          <select
            value={formData.gender}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            name="gender"
            className={styles.editFormSelect}
          >
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </label>

        <p className={styles.editFormText}>이메일 연동</p>
        <label className={styles.editFormLabel}>
          구글:
          <input
            type="text"
            name="google"
            value={formData.google}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className={styles.editFormInput}
          />
        </label>
        <label className={styles.editFormLabel}>
          네이버:
          <input
            type="text"
            name="naver"
            value={formData.naver}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className={styles.editFormInput}
          />
        </label>
        <label className={styles.editFormLabel}>
          카카오:
          <input
            type="text"
            name="kakao"
            value={formData.kakao}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className={styles.editFormInput}
          />
        </label>

        {formData.faceId ? (
          <button
            type="button"
            onClick={handleDeleteFaceID}
            className={styles.deleteFaceidBtn}
          >
            Face ID 삭제
          </button>
        ) : (
          <button
            type="button"
            className={styles.faceidRegisterBtn}
            onClick={() => navigate("/FaceIdRegister")}
          >
            Face ID 등록
          </button>
        )}

        <button
          type="button"
          onClick={handleSave}
          className={styles.saveBtn}
          disabled={!isModified} // 변경된 값이 없을 때 버튼 비활성화
        >
          저장
        </button>
      </form>
    </div>
  );
}

export default MyPageUpdate;
