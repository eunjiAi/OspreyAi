// src/pages/PostsDetail.js
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import styles from "./PostsDetail.module.css";
import ReplyWrite from "./ReplyWrite";
import { AuthContext } from "../../AuthProvider";

const PostsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState(null);
  const [replies, setReplies] = useState([]);
  const [showReplyForm, setShowReplyForm] = useState(false);  // 댓글 입력창 표시 여부
  const { isLoggedIn, accessToken, userid } = useContext(AuthContext);

    // 댓글 | 대댓글 등록 타겟 변수
    const [replyTarget, setReplyTarget] = useState(null);

  // 댓글 | 대댓글 수정 상태 관리
  const [editingReply, setEditingReply] = useState(null); //수정중인 댓글 변호(ID) 저장
  const [editingContent, setEditingContent] = useState(""); //수정 중인 댓글 내용 저장용

  // fetchPostsDetail 함수를 useEffect 밖으로 이동
  const fetchPostsDetail = async () => {
    try {
      const response = await apiClient.get(`/posts/${id}`);
      const { posts, replies } = response.data;
      setPosts(posts);
      setReplies(replies);
    } catch (error) {
      console.error("게시글 상세 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchPostsDetail();
  }, [id]);

  const handleReplyAdded = () => {
    setShowReplyForm(false);  // 댓글이 추가되면 입력창을 숨김
    fetchPostsDetail();  // 댓글 목록 갱신
  };

  const handleReplyToggle = () => {
    setShowReplyForm(!showReplyForm);  // 댓글 입력창 토글
  };

  const handleDeleteReply = async (replyId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      try {
        await apiClient.delete(`/reply/${replyId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });
        alert("댓글이 삭제되었습니다.");
        fetchPostsDetail();  // 댓글 목록 갱신
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        alert("댓글 삭제에 실패했습니다.");
      }
    }
  };

    // 댓글 | 대댓글 수정 버튼 클릭시, 내용이 input 으로 변경 처리하는 핸들러
    const handleReplyEdit = (replyId, rcontent) => {
      setEditingReply(replyId);
      setEditingContent(rcontent);
    };

  const handleSaveReplyEdit = async (replyId) => {
    try {
      await apiClient.put(`/reply/${replyId}`, 
        { 
          replyId: replyId,
          rcontent: editingContent,
        }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      setReplies((prevReplies) =>
        prevReplies.map((reply) =>
          reply.replyId === replyId
            ? { ...reply, rcontent: editingContent }
            : reply
        )
      );
      setEditingReply(null);
      alert("댓글이 수정되었습니다.");
      fetchPostsDetail();  // 댓글 목록 갱신
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  return (
    <div className={styles.detailContainer}>
      {/* 제목과 버튼 그룹 */}
      <div className={styles.titleAndButtons}>
        <h2 className={styles.detailTitle}>{posts?.title}</h2>
        <div className={styles.topButtons}>
          <button onClick={() => navigate("/posts")} className={styles.backButton}>목록</button>
        </div>
      </div>

      {/* 작성자, 등록날짜, 조회수 */}
      <div className={styles.postInfo}>
        <span>{posts?.nickname}</span>
        <span>|</span>
        <span>{posts?.postDate}</span>
        <span>| 조회수: {posts?.postCount}</span>
      </div>

      {/* 게시글 내용 */}
      <div   style={{ whiteSpace: "pre-line" }}
      className={styles.detailContent}>{posts?.content}</div>

      {/* 댓글 등록 버튼 */}
      <button className={styles.replyButton} onClick={handleReplyToggle}>
        댓글 달기
      </button>

      {/* 댓글 입력창이 열리면 ReplyWrite 컴포넌트 표시 */}
      {showReplyForm && (
        <ReplyWrite postId={id} onReplyAdded={handleReplyAdded} />
      )}

      {/* 댓글 목록 */}
      <table className={styles.replyTable}>
        <thead>
          <tr>
            <th>작성자</th>
            <th>내용</th>
            <th>등록날짜</th>
            <th>수정|삭제</th>
          </tr>
        </thead>
        <tbody>
          {replies.map((reply) => (
            <tr key={reply.replyId}>
              <td>{reply.rwriter}</td>
              <td>
                {editingReply === reply.replyId ? (
                  <input
                    type="text"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                ) : (
                  reply.rcontent
                )}
              </td>
              <td>{reply.rdate}</td>
              <td>
                {isLoggedIn &&
                  userid === reply.rwriter &&
                  (editingReply === reply.replyId ? (
                    <button onClick={() => handleSaveReplyEdit(reply.replyId)}>
                      저장
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          handleReplyEdit(reply.replyId, reply.rcontent)
                        }
                      >
                        수정
                      </button>
                      <button onClick={() => handleDeleteReply(reply.replyId)}>삭제</button>
                    </>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostsDetail;
