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
        {/* 제목과 목록 버튼 */}
        <div className={styles.titleAndButtons}>
          <h2 className={styles.detailTitle}>공지사항</h2>
          <span
            onClick={() => navigate("/notice")}
            className={styles.actionLink}
          >
            목록
          </span>
        </div>

        {/* 공지사항 정보 */}
        <div className={styles.noticeMeta}>
          작성자: {notice.nnickname} | 등록 날짜 : {notice.ncreatedAt} | 조회수:{" "}
          {notice.ncount}
          {/* 첨부파일 */}
          {notice.ofileName ? (
            <div className={styles.attachedFilePlaceholder}>
              <span className={styles.fileIcon}>📎</span>
              <span
                className={styles.fileLink}
                onClick={() =>
                  handleFileDownload(notice.ofileName, notice.rfileName)
                }
              >
                {notice.ofileName}
              </span>
            </div>
          ) : (
            <div className={styles.attachedFilePlaceholder}>
              <span className={styles.noFile}>첨부된 파일 없음</span>
            </div>
          )}
        </div>

        {/* 공지사항 본문 */}
        <div className={styles.detailContent} style={{ marginBottom: "500px" }}>
          {notice.ncontent}
        </div>

        {/* 액션 버튼 */}
        {isLoggedIn && role === "ADMIN" && (
          <div className={styles.actionsContainer}>
            <span className={styles.actionLink} onClick={handleMoveEdit}>
              수정
            </span>
            <span className={styles.separator}>|</span>
            <span
              className={styles.actionLink}
              onClick={() => handleDelete(notice.rfileName)}
            >
              삭제
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeDetail;
