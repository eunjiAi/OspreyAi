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
    <div className="detail-container">
      <h2 className="detail-title"> {id}번 게시글 상세보기</h2>
      <table border="2">
        <tbody>
          <tr>
            <th>번호</th>
            <td>{posts.postId}</td>
          </tr>
          <tr>
            <th>제목</th>
            <td>{posts.title}</td>
          </tr>
          <tr>
            <th>작성자</th>
            <td>{posts.nickname}</td>
          </tr>
          <tr>
            <th>첨부파일</th>
            <td>
              {posts.fileName ? (
                <button
                  onClick={() =>
                    handleFileDownload(posts.fileName, posts.renameFile)
                  }
                >
                  {posts.fileName}
                </button>
              ) : (
                "첨부파일 없음"
              )}
            </td>
          </tr>
          <tr>
            <th>등록날짜</th>
            <td>{posts.postDate}</td>
          </tr>
          <tr>
            <th>내용</th>
            <td>{posts.content}</td>
          </tr>
          <tr>
            <th>조회수</th>
            <td>{posts.postCount}</td>
          </tr>
        </tbody>
      </table>
      {/* 자신의 글만 수정 및 삭제 버튼 표시 */}
      <div className="button-group">
        {isLoggedIn && (posts.writer === userid || role === "ADMIN") && (
          <>
            <button onClick={handleMoveEdit} className="edit-button">
              수정 페이지로 이동
            </button>
            <button
              onClick={() => handleDelete(posts.renameFile)}
              className="delete-button"
            >
              삭제하기
            </button>
          </>
        )}
        <button
          onClick={() => navigate("/posts")}
          className="button"
        >
          목록
        </button>
      </div>
    </div>
  );
};

export default PostsDetail;