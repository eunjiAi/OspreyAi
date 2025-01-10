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
  const [photoFile, setPhotoFile] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState('');
    // 첨부파일 이미지 본문에 삽입 변수
    const [imageUrl, setImageUrl] = useState(null);
    const [showImage, setShowImage] = useState(null);


  // 댓글 | 대댓글 수정 상태 관리
  const [editingReply, setEditingReply] = useState(null); //수정중인 댓글 변호(ID) 저장
  const [editingContent, setEditingContent] = useState(""); //수정 중인 댓글 내용 저장용

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

  // useEffect(() => {
  //   if (posts?.fileName) {
  //     // 첨부파일이 이미지인 경우만 처리
  //     const fileExtension = posts?.fileName.split('.').pop().toLowerCase();
  //     if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
  //       setImageUrl(`${apiClient.defaults.baseURL}/uploads/${posts?.renameFile}`);
  //     } else {
  //       setImageUrl(null);  // 이미지가 아닐 경우, null 처리
  //     }
  //   }
  // }, [posts]);

  // fetchPostsDetail 함수를 useEffect 밖으로 이동
  const fetchPostsDetail = async () => {
    try {
      const response = await apiClient.get(`/posts/${id}`);
      const { posts, replies } = response.data;
      setPosts(posts);
      setReplies(replies);

      if (posts?.renameFile || posts?.fileName) {
        const fileUrl = posts.renameFile
          ? `/uploads/${posts.renameFile}`
          : `/uploads/${posts.fileName}`;
        setShowImage(fileUrl);
      } else {
        setShowImage(null);
      }
    } catch (error) {
      console.error("게시글 상세 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchPostsDetail();
    return () => {
      if (showImage) {
        URL.revokeObjectURL(showImage);
      }
    };
  }, [id]);


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

  const getReplyCount = () => replies.length;

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
    <div className={styles.pageBackground}>
      <div className={styles.detailContainer}>
        {/* 제목과 버튼 그룹 */}
        <div className={styles.titleAndButtons}>
          <h2 className={styles.detailTitle}>{posts?.title}</h2>
          <div className={styles.topButtons}>
            <button onClick={() => navigate("/posts")} className={styles.backButton}>목록</button>
          </div>
        </div>
  
        <div className={styles.postInfo}>
  <span>{posts?.nickname}</span>
  <span> | </span>
  <span>{posts?.postDate}</span>
  <span> | 조회수: {posts?.postCount}</span>
  {posts?.fileName ? (
    <div className={styles.attachedFilePlaceholder}>
      <span className={styles.fileIcon}>📎</span>
      <a
        className={styles.fileLink}
        onClick={() => handleFileDownload(posts.fileName, posts.renameFile)}
      >
        {posts.fileName}
      </a>
    </div>
  ) : (
    <div className={styles.attachedFilePlaceholder}>
      <span className={styles.fileIcon}></span>
      <span className={styles.noFile}>첨부된 파일 없음</span>
    </div>
  )}
</div>
        <div className={styles.detailContent} style={{ marginBottom: "500px" }}>
  <div style={{ whiteSpace: "pre-line" }}>{posts?.content}</div>
  {showImage && (
  <div className={styles.imagePreviewContainer}>
    <img
      src={showImage}
      alt="첨부된 이미지"
      className={styles.attachedImage}
    />
  </div>
)}
</div>


{isLoggedIn && (
          <div className={styles.actionsContainer}>
            <span 
              className={styles.actionLink} 
              onClick={() => setShowReplyForm(!showReplyForm)}>
              댓글 달기 ({getReplyCount()})
            </span>
            {posts?.writer === userid && (
              <>
                <span className={styles.separator}>|</span>
                <span 
                  className={styles.actionLink} 
                  onClick={() => navigate(`/posts/edit/${id}`)}>
                  수정
                </span>
                <span className={styles.separator}>|</span>
                <span 
                  className={styles.actionLink} 
                  onClick={() => {
                    if (window.confirm("게시글을 삭제하시겠습니까?")) {
                      apiClient.delete(`/posts/${id}`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                      }).then(() => navigate("/posts"));
                    }
                  }}>
                  삭제
                </span>
              </>
            )}
          </div>
        )}
        
        {/* 댓글 입력창이 열리면 ReplyWrite 컴포넌트 표시 */}
        {showReplyForm && (
          <ReplyWrite postId={id} onReplyAdded={handleReplyAdded} />
        )}
  
        {/* 댓글 목록 */}
        <div className={styles.repliesContainer}>
          {replies.map((reply) => (
            <div key={reply.replyId} className={styles.replyItem}>
              <div className={styles.replyHeader}>
                <span className={styles.replyAuthor}>{reply.rwriter}</span>
                <span className={styles.replyDate}>{reply.rdate}</span>
              </div>
              <div className={styles.replyContent}>
                {editingReply === reply.replyId ? (
                  <input
                    type="text"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                ) : (
                  <span>{reply.rcontent}</span>
                )}
              </div>
              {isLoggedIn && userid === reply.rwriter && (
                <div className={styles.replyActions}>
                  {editingReply === reply.replyId ? (
                    <button onClick={() => handleSaveReplyEdit(reply.replyId)}>저장</button>
                  ) : (
                    <>
                      <button onClick={() => handleReplyEdit(reply.replyId, reply.rcontent)}>수정</button>
                      <button onClick={() => handleDeleteReply(reply.replyId)}>삭제</button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

};
  

// {/* 첨부된 이미지 표시 */}
// {imageUrl && (
//   <div className={styles.imagePreviewContainer}>
//     <img src={imageUrl} alt="첨부된 이미지" className={styles.attachedImage} />
//   </div>
// )}
export default PostsDetail;
