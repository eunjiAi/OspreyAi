import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostsCreate.css";

const BoardCreate = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() && content.trim()) {
      alert(`New Post Created!\nTitle: ${title}\nContent: ${content}`);

      navigate("/Board");
    } else {
      alert("Please fill in all fields before submitting.");
    }
  };

  const handleCancel = () => {
    navigate("/Board");
  };

  return (
    <div className="create-container">
      <h1 className="create-title">게시글 등록</h1>
      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">제목</label>
          <input
            type="text"
            id="title"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content" className="form-label">상세내용</label>
          <textarea
            id="content"
            className="form-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="상세내용을 입력하세요"
          ></textarea>
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-button">게시글 등록</button>
          <button type="button" className="cancel-button" onClick={handleCancel}>취소</button>
        </div>
      </form>
    </div>
  );
};

export default BoardCreate;
