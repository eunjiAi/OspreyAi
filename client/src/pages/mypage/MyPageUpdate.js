import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import axios from "axios";
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
    email: "",
    faceId: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModified, setIsModified] = useState(false);

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      if (!accessToken || !userid) {
        console.log(
          "Access token 또는 userid가 준비되지 않았습니다. 대기 중..."
        );
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.get(`/member/mypage/${userid}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setInitialData(response.data);
        setFormData(response.data);
      } catch (err) {
        setError("회원 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userid, accessToken]); // accessToken과 userid가 변경되면 호출

  // 수정 상태 확인
  useEffect(() => {
    setIsModified(JSON.stringify(initialData) !== JSON.stringify(formData));
  }, [formData, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const updatedValue = value.replace(/\s+/g, ''); // 모든 공백 제거

    setFormData({ ...formData, [name]: updatedValue });
  };

  // 저장 버튼 클릭
  const handleSave = async () => {
    if (!formData.nickname || formData.nickname.trim() === "") {
      alert("닉네임을 입력해주세요.");
      return; // 빈 값이 있을 경우 제출 방지
    }

    // 전화번호가 빈 값이면 제출하지 않도록 처리
    if (!formData.phoneNumber || formData.phoneNumber.trim() === "") {
      alert("전화번호를 입력해주세요.");
      return; // 빈 값이 있을 경우 제출 방지
    }

    const phoneRegex = /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      alert("올바른 전화번호 형식(010-0000-0000)을 입력해주세요.");
      return;
    }
  
    try {
      await apiClient.put(`/member/mypage/${uuid}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("회원 정보가 성공적으로 수정되었습니다.");
      navigate(-1);
    } catch (err) {
      alert("회원 정보 수정에 실패했습니다.");
    }
  };

  // Face ID 삭제
  const handleDeleteFaceID = async () => {
    try {
      await apiClient.post("http://localhost:5001/delete-faceid", { uuid });
      alert("Face ID가 성공적으로 삭제되었습니다.");
      setFormData({ ...formData, faceId: "" });
    } catch {
      alert("Face ID 삭제에 실패했습니다.");
    }
  };

  const handlePhoneNumberChange = (e) => {
    const { name, value } = e.target;

    // 010을 고정값으로 처리하고, 나머지 값만 받는다
    if (!value.startsWith("010")) {
      return; // 010 이외의 값은 처리하지 않음
    }
  
    // 하이픈을 제외한 숫자만 추출
    let formattedValue = value.replace(/[^\d]/g, ''); // 숫자가 아닌 문자는 모두 제거

    // 010은 고정값이므로 010을 추가하고 나머지 값만 처리
    formattedValue = "010" + formattedValue.slice(3); // 010 고정 후, 나머지 부분만 슬라이싱
  
    // 백스페이스 처리: 길이가 4, 8이면 해당 위치에서 하이픈 제거
    if (formattedValue.length > 3 && formattedValue.length <= 6) {
      formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3)}`;
    } else if (formattedValue.length > 7) {
      formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3, 7)}-${formattedValue.slice(7, 11)}`;
    }
  
    // 상태 업데이트
    setFormData({ ...formData, [name]: formattedValue });
  };

  // Google 연동 ---------------------------------------------------------------------------------------------------
  const handleGoogleLink = async () => {
    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const GOOGLE_REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
    const GOOGLE_SCOPE = "email profile openid";

    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=token&scope=${GOOGLE_SCOPE}`;
    const popup = window.open(
      googleLoginUrl,
      "Google Login",
      "width=500,height=600,scrollbars=yes"
    );

    if (!popup) {
      alert("팝업이 차단된 것 같습니다. 팝업 차단을 해제해주세요.");
      return;
    }

    const interval = setInterval(() => {
      try {
        const currentUrl = popup.location.href;

        if (currentUrl.includes("access_token")) {
          const params = new URLSearchParams(currentUrl.split("#")[1]);
          const accessToken = params.get("access_token");

          popup.close();
          clearInterval(interval);

          // Google 연동 완료 후 서버와 통신
          linkGoogleAccount(accessToken);
        }
      } catch (error) {
        // URL 접근 권한이 없을 경우 발생 (무시 가능)
      }
    }, 500);
  };

  const linkGoogleAccount = async (accessToken) => {
    try {
      // Google API를 사용하여 사용자 이메일 가져오기
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const email = response.data.email;
      console.log("Google 사용자 이메일:", email);

      // 이메일을 서버로 전송하여 연동 완료
      await apiClient.post(
        `/member/google`,
        { email, uuid },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      alert("Google 연동이 완료되었습니다.");
      setFormData({ ...formData, google: email });
    } catch (error) {
      console.error("Google 연동 처리 실패:", error);
      alert("Google 연동에 실패했습니다.");
    }
  };

  const unlinkGoogleAccount = async () => {
    try {
      await apiClient.put(
        `/member/google`,
        { uuid },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      alert("Google 연동 해제가 완료되었습니다.");
      setFormData({ ...formData, google: "" });
    } catch {
      alert("Google 연동 해제에 실패했습니다.");
    }
  };

  // Naver 연동 ---------------------------------------------------------------------------------------------------
  const handleNaverLink = () => {
    const naverLinkUrl = process.env.REACT_APP_NAVER_LINK_URL;
    console.log("Naver Login URL:", naverLinkUrl);

    const popup = window.open(
      naverLinkUrl,
      "Naver Login",
      "width=500,height=600,scrollbars=yes"
    );

    if (!popup) {
      alert("팝업이 차단된 것 같습니다. 팝업 차단을 해제해주세요.");
      return;
    }
  };

  const unlinkNaverAccount = async () => {
    try {
      await apiClient.put(
        `/member/naver`,
        { uuid },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      alert("Naver 연동 해제가 완료되었습니다.");
      setFormData({ ...formData, naver: "" });
    } catch {
      alert("Naver 연동 해제에 실패했습니다.");
    }
  };

  // Kakao 연동 ---------------------------------------------------------------------------------------------------
  const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
  const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

  const handleKakaoLink = () => {
    const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    console.log("Kakao Login URL:", kakaoLoginUrl);

    const popup = window.open(
      kakaoLoginUrl,
      "Kakao Login",
      "width=500,height=600,scrollbars=yes"
    );

    if (!popup) {
      alert("팝업이 차단된 것 같습니다. 팝업 차단을 해제해주세요.");
      return;
    }

    const interval = setInterval(() => {
      try {
        const currentUrl = popup.location.href;

        if (currentUrl.includes("code")) {
          const params = new URLSearchParams(currentUrl.split("?")[1]);
          const authCode = params.get("code");
          console.log("Kakao Authorization Code:", authCode);

          popup.close();
          clearInterval(interval);

          // 액세스 토큰 요청
          handleKakaoCallback(authCode);
        }
      } catch (error) {
        // URL 접근 권한이 없을 경우 발생 (무시 가능)
      }
    }, 500);
  };

  const handleKakaoCallback = async (authCode) => {
    try {
      const tokenResponse = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        null,
        {
          params: {
            grant_type: "authorization_code",
            client_id: KAKAO_CLIENT_ID,
            redirect_uri: KAKAO_REDIRECT_URI,
            code: authCode,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = tokenResponse.data.access_token;
      console.log("Kakao Access Token:", accessToken);

      const userInfoResponse = await axios.get(
        "https://kapi.kakao.com/v2/user/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const email = userInfoResponse.data.kakao_account.email;
      console.log("Kakao 사용자 이메일:", email);

      await apiClient.post(
        `/member/kakao`,
        { email, uuid },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      alert("Kakao 연동이 완료되었습니다.");
      setFormData({ ...formData, kakao: email });
    } catch (error) {
      console.error("Kakao 연동 처리 실패:", error);
      alert("Kakao 연동에 실패했습니다.");
    }
  };

  const unlinkKakaoAccount = async () => {
    try {
      await apiClient.put(
        `/member/kakao`,
        { uuid },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      alert("Kakao 연동 해제가 완료되었습니다.");
      setFormData({ ...formData, kakao: "" });
    } catch {
      alert("Kakao 연동 해제에 실패했습니다.");
    }
  };

  if (loading) return <div className={styles.mypageLoading}>로딩 중...</div>;
  if (error) return <div className={styles.mypageError}>{error}</div>;

  return (
    <div className={styles.mypageEditContainer}>
      <h1 className={styles.mypageEditTitle}>회원정보 수정</h1>
      <form className={styles.mypageEditForm}>
        <label className={styles.mypageLabel}>
          이름:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={styles.mypageInput}
            required
          />
        </label>
        <label className={styles.mypageLabel}>
          닉네임:
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
            className={styles.mypageInput}
            required
          />
        </label>
        <label className={styles.mypageLabel}>
          전화번호:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="010-0000-0000"
            className={styles.mypageInput}
            required
          />
        </label>
        <label className={styles.mypageLabel}>
          성별:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={styles.mypageSelect}
            style={{ width: 605 }}
          >
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </label>
        <label className={styles.mypageLabel}>
          이메일(수정불가):
          <input
            type="text"
            name="email"
            value={formData.email}
            className={styles.mypageInput}
            readOnly
          />
        </label>

        {/* Google 연동 버튼 */}
        <div>
          {formData.google ? (
            <button
              type="button"
              onClick={unlinkGoogleAccount}
              className={`${styles.mypageButton} ${styles.mypageSocialUnlinkButton}`}
            >
              Google 연동 해제
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGoogleLink}
              className={`${styles.mypageButton} ${styles.mypageSocialButton}`}
            >
              Google 연동
            </button>
          )}
        </div>
        {/* Naver 연동 버튼 */}
        <div>
          {formData.naver ? (
            <button
              type="button"
              onClick={unlinkNaverAccount}
              className={`${styles.mypageButton} ${styles.mypageSocialUnlinkButton}`}
            >
              Naver 연동 해제
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNaverLink}
              className={`${styles.mypageButton} ${styles.mypageSocialButton}`}
            >
              Naver 연동
            </button>
          )}
        </div>
        {/* Kakao 연동 버튼 */}
        <div>
          {formData.kakao ? (
            <button
              type="button"
              onClick={unlinkKakaoAccount}
              className={`${styles.mypageButton} ${styles.mypageSocialUnlinkButton}`}
            >
              Kakao 연동 해제
            </button>
          ) : (
            <button
              type="button"
              onClick={handleKakaoLink}
              className={`${styles.mypageButton} ${styles.mypageSocialButton}`}
            >
              Kakao 연동
            </button>
          )}
        </div>

        {/* Face ID */}
        {formData.faceId ? (
          <button
            type="button"
            onClick={handleDeleteFaceID}
            className={`${styles.mypageButton} ${styles.mypageFaceIDButton}`}
          >
            Face ID 삭제
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/FaceIdRegister")}
            className={`${styles.mypageButton} ${styles.mypageFaceIDButton}`}
          >
            Face ID 등록
          </button>
        )}

        {/* 저장 버튼 */}
        <button
          type="button"
          onClick={handleSave}
          className={`${styles.mypageButton} ${
            isModified
              ? styles.mypageButtonPrimary
              : styles.mypageButtonDisabled
          }`}
          disabled={!isModified}
        >
          저장
        </button>
      </form>
    </div>
  );
}

export default MyPageUpdate;
