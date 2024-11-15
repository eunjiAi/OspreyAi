import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BoardDetail.css';

function BoardDetail({ posts, setPosts }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find((post) => post.id === Number(id));

  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(post.title);
  const [updatedContent, setUpdatedContent] = useState(post.content);

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const handleDelete = () => {
    const updatedPosts = posts.filter((p) => p.id !== post.id);
    setPosts(updatedPosts);
    alert('게시글이 삭제되었습니다.');
    navigate('/');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedPosts = posts.map((p) =>
      p.id === post.id ? { ...p, title: updatedTitle, content: updatedContent } : p
    );
    setPosts(updatedPosts);
    setIsEditing(false);
    alert('게시글이 수정되었습니다.');
  };

  return (
    <div className="board-detail-container">
      {isEditing ? (
        <>
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            className="title-input"
          />
          <textarea
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            className="content-input"
          ></textarea>
          <button onClick={handleSave} className="save-button">저장</button>
        </>
      ) : (
        <>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-content">{post.content}</p>
          <button onClick={handleEdit} className="edit-button">수정</button>
          <button onClick={handleDelete} className="delete-button">삭제</button>
        </>
      )}
    </div>
  );
}

export default BoardDetail;
