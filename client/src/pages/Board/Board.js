import React, { useState } from 'react';
import './Board.css';
import { Link, useNavigate } from 'react-router-dom';

function Board({ posts, setPosts }) {
  const navigate = useNavigate();

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="board-container">
      <header className="board-header">
        <h1 className="board-title">게시판</h1>
        <Link to="/BoardCreate" className="new-post-button">새 글 작성</Link>
      </header>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item" onClick={() => handlePostClick(post.id)}>
            <div className="post-link">
              <div className="post-title">{post.title}</div>
              <div className="post-date">{post.date}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Board;
