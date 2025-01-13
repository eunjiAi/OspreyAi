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
        setError("공지사항 조회에 실패했습니다.");
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
      alert("첨부파일 다운로드에 실패했습니다.");
    }
  };

  const handleMoveEdit = () => {
    navigate(`/notice/edit/${id}`);
  };

  const handleDelete = async (rfile) => {
    if (window.confirm("이 공지사항을 삭제하시겠습니까?")) {
      try {
        await apiClient.delete(`/notice/${id}`, {
          params: { rfile: rfile },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        alert("공지사항이 성공적으로 삭제되었습니다.");
        navigate("/notice");
      } catch (error) {
        console.error("Delete error:", error);
        alert("공지사항 삭제에 실패했습니다.");
      }
    }
  };

  if (loading)
    return (
      <div className={styles.loading}>공지사항을 불러오는 중입니다...</div>
    );
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.pageBackground}>
      <div className={styles.detailContainer}>
        <h2 className={styles.detailTitle}>공지사항</h2>
        <div className={styles.detailContent} style={{ marginBottom: "500px" }}>
          <h3 className={styles.noticeTitle}>{notice.ntitle}</h3>
          <p className={styles.noticeMeta}>
            작성자: {notice.nnickname} | 등록일: {notice.ncreatedAt} | 조회수:{" "}
            {notice.ncount}
          </p>
          <div className={styles.noticeBody}>
            <p className={styles.noticeText}>{notice.ncontent}</p>
            {notice.ofileName && (
              <button
                className={styles.fileButton}
                onClick={() =>
                  handleFileDownload(notice.ofileName, notice.rfileName)
                }
              >
                첨부파일: {notice.ofileName}
              </button>
            )}
          </div>
        </div>
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
    </div>
  );
};

export default NoticeDetail;
