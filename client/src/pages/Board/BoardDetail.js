import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BoardDetail.css";

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([
    { id: 1, title: "Welcome to the Board!", content: "Feel free to share your thoughts here.", comments: ["Great post!", "Very helpful!"] },
    { id: 2, title: "React Tips & Tricks", content: "Learn how to build amazing apps.", comments: ["Thanks for sharing!", "This is awesome."] },
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
        ← Back to Board
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
          {isEditing ? "Save" : "Edit"}
        </button>
        <button className="delete-button" onClick={handleDelete}>
          Delete
        </button>
      </div>
      <div className="comments-section">
        <h2>Comments</h2>
        <ul>
          {post.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
        <div className="add-comment">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
