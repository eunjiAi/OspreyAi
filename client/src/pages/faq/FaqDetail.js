// src/pages/notice/noticeDetail.js  => 공지글 상세보기 출력 페이지
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; //이전 페이지에서 전달온 값을 받기 위함
import apiClient from "../../utils/axios";
import styles from "./FaqDetail.module.css";
import { AuthContext } from "../../AuthProvider";

const FaqDetail = () => {
  const { no } = useParams(); // URL 에서 no 파라미터를 가져옴(추출함)
  const navigate = useNavigate(); //useNavigate 훅 사용
  const [faqQ, setFaqQ] = useState(null); //자주하는질문 데이터 저장할 상태 변수 선언과 초기화함
  const [faqA, setFaqA] = useState(null);
  const [error, setError] = useState(null); //에러 메세지 저장용 상태 변수 선언과 초기화

  const { isLoggedIn, role, accessToken } = useContext(AuthContext); // AuthProvider 에서 가져오기

  useEffect(() => {
    //서버측에 요청해서 해당 공지글 가져오는 ajax 통신 처리 함수를 작성할 수 있음
    const fetchFaqDetail = async () => {
      console.log("no : " + no);
      try {
        // url path 와 ${변수명} 를 같이 사용시에는 반드시 빽틱(``)을 표시해야 함 (작은따옴표 아님 : 주의)
        const response = await apiClient.get(`/faq/${no}`);
        setFaqQ(response.data.Q); //서버측에서 받은 데이터 저장 처리
        setFaqA(response.data.A || null);
      } catch (error) {
        setError("자주하는질문 상세 조회 실패!");
        console.error(error);
      }
    };

    //작성된 함수 실행
    fetchFaqDetail();
  }, [no]);

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await apiClient.delete(`/faq/${no}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // accessToken 추가
          },
        });
        alert("삭제가 완료되었습니다.");
        navigate("/faq"); //목록 출력 페이지로 이동
      } catch (error) {
        console.error("Delete error : ", error);
        alert("삭제 실패!");
      }
    }
  };

  if (faqQ == null) {
    return <div className={styles.faqLoading}>로딩 중...</div>; // 로딩 표시
  }

  if (error) {
    return <div className={styles.faqError}>{error}</div>; // 에러 메시지 표시
  }

  return (
    <div className={styles.faqContainer}>
      <div className={styles.faqBlock}>
        <h3 className={styles.faqQuestion}>{faqQ.faqTitle}</h3>
        <p className={styles.faqContent}>{faqQ.faqContent}</p>
        <p className={styles.faqMeta}>
          <span>카테고리: {faqQ.category}</span> |{" "}
          <span>등록 날짜: {faqQ.createdAt}</span> |{" "}
          <span>조회수: {faqQ.viewCount}</span>
        </p>
      </div>
      {faqA && (
        <div className={styles.faqBlock}>
          <h3 className={styles.faqAnswerTitle}>답변</h3>
          <p className={styles.faqContent}>{faqA.faqContent}</p>
          <p className={styles.faqMeta}>
            <span>카테고리: {faqA.category}</span> |{" "}
            <span>등록 날짜: {faqA.createdAt}</span>
          </p>
        </div>
      )}
      {/* ADMIN 권한만 삭제 버튼 표시 */}
      <div className={styles.faqActions}>
        {isLoggedIn && role === "ADMIN" && (
          <button className={styles.faqButton} onClick={handleDelete}>
            삭제하기
          </button>
        )}
        <button className={styles.faqButton} onClick={() => navigate(`/faq`)}>
          목록
        </button>
      </div>
    </div>
  );
};

export default FaqDetail;
