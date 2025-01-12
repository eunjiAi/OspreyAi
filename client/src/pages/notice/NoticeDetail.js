import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import styles from "./NoticeDetail.module.css";
import { AuthContext } from "../../AuthProvider";

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isLoggedIn, role, accessToken } = useContext(AuthContext);

  useEffect(() => {
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

    fetchNoticeDetail();
  }, [id]);

  const handleFileDownload = async (ofileName, rfileName) => {
    try {
      const response = await apiClient.get("/notice/nfdown", {
        params: { ofile: ofileName, rfile: rfileName },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", ofileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("File download error:", error);
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
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        alert("삭제가 완료되었습니다.");
        navigate("/notice");
      } catch (error) {
        console.error("Delete error:", error);
        alert("삭제 실패!");
      }
    }
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.detailContainer}>
      <h2 className={styles.detailTitle}>공지사항 상세보기</h2>
      <table className={styles.detailTable}>
        <tbody>
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
                  className={styles.fileButton}
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
            <td style={{ whiteSpace: "pre-line" }}>{notice.ncontent}</td>
          </tr>
          <tr>
            <th>조회수</th>
            <td>{notice.ncount}</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.buttonGroup}>
        {isLoggedIn && role === "ADMIN" && (
          <>
            <button
              onClick={handleMoveEdit}
              className={`${styles.button} ${styles.editButton}`}
            >
              수정
            </button>
            <button
              onClick={() => handleDelete(notice.rfileName)}
              className={`${styles.button} ${styles.deleteButton}`}
            >
              삭제
            </button>
          </>
        )}
        <button
          onClick={() => navigate("/notice")}
          className={`${styles.button} ${styles.backButton}`}
        >
          목록
        </button>
      </div>
    </div>
  );
};

export default NoticeDetail;
