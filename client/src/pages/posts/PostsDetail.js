import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import styles from "./PostsDetail.module.css";
import Modal from '../../components/common/Modal';
import ReplyWrite from "./ReplyWrite";
import { AuthContext } from "../../AuthProvider";

const PostsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const [replies, setReplies] = useState([]);  //댓글 데이터 상태 관리
  const [loading, setLoading] = useState(true);

  // 모달 처리용
  const [showModal, setShowModal] = useState(false);
  // 댓글 | 대댓글 등록 타겟 변수
  const [replyTarget, setReplyTarget] = useState(null);

   // 댓글 | 대댓글 수정 상태 관리
   const [editingReply, setEditingReply] = useState(null);  //수정중인 댓글 변호(ID) 저장
   const [editingContent, setEditingContent] = useState('');  //수정 중인 댓글 내용 저장용
  

  const { isLoggedIn, role, accessToken, userid } = useContext(AuthContext);

  useEffect(() => {
    const fetchPostsDetail = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/posts/${id}`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching notice details:", error);
        setError("게시글 상세 조회 실패!");
      } finally {
        setLoading(false);
      }
    };

    fetchPostsDetail();
  }, [id]);

     // 모달창 열기 함수
     const openModal = ({ postId, replyId = null }) => {
      setReplyTarget({ postId, replyId });
      setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setReplyTarget(null);
    window.location.reload();  // 페이지 새로고침 추가
};

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

  const handleReplyDelete = async (replyId) => {
    if(window.confirm('댓글을 삭제하시겠습니까?')){
        try{
            await apiClient.delete(`/reply/${replyId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // accessToken 추가
                },
            });
            setReplies((prevReplies) => prevReplies.filter((reply) => reply.replyId !== replyId));
            alert('댓글이 삭제되었습니다.');

            window.location.reload();
        }catch(error){
            alert('댓글 삭제에 실패했습니다.');
        }
    }
};

// 댓글 | 대댓글 수정 버튼 클릭시, 제목과 내용이 input 으로 변경 처리하는 핸들러
const handleReplyEdit = (replyId, rcontent) => {
    setEditingReply(replyId);
    setEditingContent(rcontent);
};

// 댓글 | 대댓글 수정하고 저장 버튼 클릭시 작동할 핸들러
const handleSaveReplyEdit = async (replyId) => {
    try {
        await apiClient.put(`/reply/${replyId}`, {
            replyId: replyId,
            rcontent: editingContent
        }, {
            headers: { Authorization: `Bearer ${accessToken}`}
        });

        setReplies((prevReplies) => prevReplies.map((reply) => reply.replyId === replyId 
                                        ? { ...reply, rcontent: editingContent} 
                                        : reply));
        setEditingReply(null);
        alert('댓글이 수정되었습니다.');
    } catch (error) {
        alert('댓글 수정에 실패했습니다.');
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
          {isLoggedIn && posts.writer === userid ? (
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
) : (
  isLoggedIn && (
    <button onClick={() => openModal({ postId: posts.postId })}>
      댓글 등록
    </button>
  )
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
                <h3>댓글</h3>
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
                            <tr key={reply.replyId} 
                                className={reply.replyLev === 2 ? styles.replyIndented : styles.replyItem}>
                                <td>{reply.rwriter}</td>
                                <td>
                                    {editingReply === reply.replyId ? (
                                        <input type="text"
                                            value={editingContent}
                                            onChange={(e) => setEditingContent(e.target.value)} />
                                    ) : (
                                        reply.rcontent
                                    )}                               
                                </td>
                                <td>{reply.rdate}</td>
                                <td>
                                  {isLoggedIn && userid === reply.rwriter && (
                                    editingReply === reply.replyId ? (
                                      <button onClick={() => handleSaveReplyEdit(reply.replyId)}>저장</button>
                                  ) : (
                                  <>
                                      <button onClick={() => handleReplyEdit(reply.replyId, reply.rcontent)}>수정</button>
                                      <button onClick={() => handleReplyDelete(reply.replyId)}>삭제</button>
                                  </>
                                  ))}
                
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                 {/* 댓글|대댓글 등록 모달창 */}
            {showModal && (
                <Modal onClose={closeModal}>
                    <ReplyWrite postId={replyTarget.postId}
                        replyId={replyTarget.replyId}
                        onReplyAdded={closeModal} />
                </Modal>
            )}

    </>
  );
};

export default PostsDetail;
