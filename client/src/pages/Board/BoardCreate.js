import React, { useState } from 'react';
import './BoardCreate.css';
import { useNavigate } from 'react-router-dom';

function BoardCreate() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      alert(`Post submitted:\nTitle: ${title}\nContent: ${content}`);
      navigate('/'); // 게시판 페이지로 이동
    } else {
      alert('Please enter both a title and content for the post.');
    }
  };

  return (
    <div className="board-create-container">
      <h1 className="create-title">새 글 작성</h1>
      <form className="create-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="title-input"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          className="content-input"
        ></textarea>
        <button type="submit" className="submit-button">등록</button>
      </form>
    </div>
  );
}

export default BoardCreate;
