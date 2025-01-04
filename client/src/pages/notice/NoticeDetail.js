import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; //이전 페이지에서 전달온 값을 받기 위함
import apiClient from "../../utils/axios";
import styles from "./NoticeDetail.css";
import { AuthContext } from "../../AuthProvider";

const NoticeDetail = () => {
  const { id } = useParams(); // URL 에서 no 파라미터를 가져옴(추출함)
  const navigate = useNavigate(); //useNavigate 훅 사용
  const [notice, setNotice] = useState(null); //공지 데이터 저장할 상태 변수 선언과 초기화함
  const [error, setError] = useState(null); //에러 메세지 저장용 상태 변수 선언과 초기화
  const [loading, setLoading] = useState(true); // 로딩 상태

  const { isLoggedIn, role, accessToken } = useContext(AuthContext);

  useEffect(() => {
    //서버측에 요청해서 해당 공지글 가져오는 ajax 통신 처리 함수를 작성할 수 있음
    const fetchNoticeDetail = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/notice/${id}`);
        setNotice(response.data);
      } catch (error) {
        console.error("Error fetching notice details:", error);
        setError("공지글 상세 조회 실패!");
      } finally {
        setLoading(false);
      }
    };

    //작성된 함수 실행
    fetchNoticeDetail();
  }, [id]);

  const handleFileDownload = async (ofileName, rfileName) => {
    try {
      const response = await apiClient.get("/notice/nfdown", {
        params: {
          ofile: ofileName,
          rfile: rfileName,
        },
        responseType: "blob", //파일 다운로드를 위한 설정
      });

      //파일 다운로드 처리
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", ofileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("File download error : ", error);
      alert("파일 다운로드에 실패했습니다.");
    }
  };

  const handleMoveEdit = () => {
    navigate(`/notice/edit/${id}`);
  };

  const handleDelete = async (rfile) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await apiClient.delete(`/notice/${id}`, {
          params: { rfile: rfile },
          headers: {
            Authorization: `Bearer ${accessToken}`, // accessToken 추가
          },
        });
        alert("삭제가 완료되었습니다.");
        //브라우저 히스토리를 이용해서, 목록 출력 페이지로 이동 <= 리액트의 히스토리를 이용한다면
        //history.push('/notice');
        navigate("/notice"); //목록 출력 페이지로 이동
      } catch (error) {
        console.error("Delete error : ", error);
        alert("삭제 실패!");
      }
    }
  };

  if (!notice) {
    return <div className={styles.loading}>로딩 중...</div>; // 로딩 표시
  }

  if (error) {
    return <div className={styles.error}>{error}</div>; // 에러 메시지 표시
  }

  return (
    <div className="detail-container">
      <h2 className="detail-title"> {id}번 공지사항 상세보기</h2>
      <table border="1">
        <tbody>
          <tr>
            <th>번호</th>
            <td>{notice.noticeNo}</td>
          </tr>
          <tr>
            <th>제목</th>
            <td>{notice.ntitle}</td>
          </tr>
          <tr>
            <th>작성자</th>
            <td>{notice.nnickname}</td>
          </tr>
          <tr>
            <th>첨부파일</th>
            <td>
              {notice.ofileName ? (
                <button
                  onClick={() =>
                    handleFileDownload(notice.ofileName, notice.rfileName)
                  }
                >
                  {notice.ofileName}
                </button>
              ) : (
                "첨부파일 없음"
              )}
            </td>
          </tr>
          <tr>
            <th>등록날짜</th>
            <td>{notice.ncreatedAt}</td>
          </tr>
          <tr>
            <th>내용</th>
            <td>{notice.ncontent}</td>
          </tr>
          <tr>
            <th>조회수</th>
            <td>{notice.ncount}</td>
          </tr>
        </tbody>
      </table>
      {/* ADMIN 권한만 수정 및 삭제 버튼 표시 */}
      {isLoggedIn && role === "ADMIN" && (
        <div>
          <button onClick={handleMoveEdit} className="edit-button">
            수정 페이지로 이동
          </button>
          <button
            onClick={() => handleDelete(notice.rfileName)}
            className="delete-button"
          >
            삭제하기
          </button>
          <input
            type="button"
            value="목록"
            onClick={() => navigate("/notice")}
          />
        </div>
      )}
    </div>
  );
}; // const NoticeDetail

export default NoticeDetail;
