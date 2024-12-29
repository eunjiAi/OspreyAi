import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PostsDetail.css";

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([
    { id: 1, title: "Osprey AI는 자세교정에 도움이 됩니다.", content: "상세내용입니다.", comments: ["따봉", "도움이 되었습니다."] },
    { id: 2, title: "OspreyAI로 오늘 바른자세 80번 달성했습니다.", content: "자랑글입니다.", comments: ["더 열심히 해서 80번보다 더 많이 해야겠네요.", "따봉"] },
    { id: 3, title: "OspreyAI로 오늘 바른자세 80번 달성했습니다.", content: "자랑글입니다.", comments: ["더 열심히 해서 80번보다 더 많이 해야겠네요.", "따봉"] },
    { id: 4, title: "OspreyAI로 오늘 바른자세 80번 달성했습니다.", content: "자랑글입니다.", comments: ["더 열심히 해서 80번보다 더 많이 해야겠네요.", "따봉"] },
    { id: 5, title: "OspreyAI로 오늘 바른자세 80번 달성했습니다.", content: "자랑글입니다.", comments: ["더 열심히 해서 80번보다 더 많이 해야겠네요.", "따봉"] },
    { id: 6, title: "OspreyAI로 오늘 바른자세 80번 달성했습니다.", content: "자랑글입니다.", comments: ["더 열심히 해서 80번보다 더 많이 해야겠네요.", "따봉"] },
    { id: 7, title: "OspreyAI로 오늘 바른자세 80번 달성했습니다.", content: "자랑글입니다.", comments: ["더 열심히 해서 80번보다 더 많이 해야겠네요.", "따봉"] },
    { id: 8, title: "OspreyAI로 오늘 바른자세 80번 달성했습니다.", content: "자랑글입니다.", comments: ["더 열심히 해서 80번보다 더 많이 해야겠네요.", "따봉"] },
  ]);

  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const post = posts.find((post) => post.id === parseInt(id));

  if (!post) {
    return <div>Post not found.</div>;
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      post.comments.push(newComment);
      setNewComment("");
    }
  };

  const handleDelete = () => {
    const updatedPosts = posts.filter((post) => post.id !== parseInt(id));
    setPosts(updatedPosts);
    navigate("/Board");
  };

  const handleEdit = () => {
    if (isEditing) {
      const updatedPosts = posts.map((p) =>
        p.id === parseInt(id) ? { ...p, content: editedContent } : p
      );
      setPosts(updatedPosts);
      setIsEditing(false);
    } else {
      setEditedContent(post.content);
      setIsEditing(true);
    }
  };

  return (
    <div className="detail-container">
      <button className="back-button" onClick={() => navigate("/Board")}>
        ← 게시판 목록으로 돌아가기
      </button>
      <h1 className="detail-title">{post.title}</h1>
      {!isEditing ? (
        <p className="detail-content">{post.content}</p>
      ) : (
        <textarea
          className="edit-content"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      )}
      <div className="button-group">
        <button className="edit-button" onClick={handleEdit}>
          {isEditing ? "Save" : "수정"}
        </button>
        <button className="delete-button" onClick={handleDelete}>
          삭제
        </button>
      </div>
      <div className="comments-section">

        <hr></hr>

        <h2>댓글</h2>
        <ul>
          {post.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
        <div className="add-comment">
          <input
            type="text"
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}>등록</button>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
