import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BoardCreate.css";

const BoardCreate = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle post creation logic
    if (title.trim() && content.trim()) {
      alert(`New Post Created!\nTitle: ${title}\nContent: ${content}`);
      // Navigate back to the board after submission
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
      <h1 className="create-title">Create a New Post</h1>
      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            id="content"
            className="form-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter post content"
          ></textarea>
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-button">Submit</button>
          <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default BoardCreate;
