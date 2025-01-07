import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import styles from "./PostsDetail.module.css";
import { AuthContext } from "../../AuthProvider";

const PostsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isLoggedIn, role, accessToken, userid } = useContext(AuthContext);

  useEffect(() => {
    const fetchPostsDetail = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/posts/${id}`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching notice details:", error);
        setError("공지글 상세 조회 실패!");
      } finally {
        setLoading(false);
      }
    };

    fetchPostsDetail();
  }, [id]);

  const handleFileDownload = async (ofileName, rfileName) => {
    try {
      const response = await apiClient.get("/posts/pfdown", {
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
      console.error("File download error : ", error);
      alert("파일 다운로드에 실패했습니다.");
    }
  };

  const handleMoveEdit = () => {
    navigate(`/posts/edit/${id}`);
  };

  const handleDelete = async (rfile) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await apiClient.delete(`/posts/${id}`, {
          params: { rfile: rfile },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        alert("삭제가 완료되었습니다.");
        navigate("/posts");
      } catch (error) {
        console.error("Delete error : ", error);
        alert("삭제 실패!");
      }
    }
  };

  if (!posts) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <>
      <div className={styles.detailContainer}>
        {/* 제목과 버튼 그룹을 한 줄로 정렬 */}
        <div className={styles.titleAndButtons}>
          <h2 className={styles.detailTitle}>{posts.title}</h2>
          <div className={styles.topButtons}>
            <input
              type="button"
              value="뒤로가기"
              className={styles.backButton}
              onClick={() => navigate("/posts")}
            />
            {isLoggedIn && posts.writer === userid && (
              <>
                <button onClick={handleMoveEdit} className={styles.editButton}>
                  수정
                </button>
                <button
                  onClick={() => handleDelete(posts.renameFile)}
                  className={styles.deleteButton}
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </div>

        {/* 작성자, 등록날짜, 조회수 */}
        <div className={styles.postInfo}>
          <span>{posts.nickname}</span>
          <span className={styles.separator}>|</span>
          <span>{posts.postDate}</span>
          <span className={styles.separator}>|</span>
          <span>조회수: {posts.postCount}</span>

          {/* 첨부파일 버튼 */}
          <div className={styles.downloadFile}>
            {posts.fileName ? (
              <button
                className={styles.downloadButton}
                onClick={() =>
                  handleFileDownload(posts.fileName, posts.renameFile)
                }
              >
                {posts.fileName}
              </button>
            ) : (
              "첨부파일 없음"
            )}
          </div>
        </div>

        {/* 게시글 내용 */}
        <div className={styles.detailContent}>{posts.content}</div>
      </div>
    </>
  );
};

export default PostsDetail;
