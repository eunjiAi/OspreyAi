import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Board.css";

const Board = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([
    { id: 1, title: "Osprey AI는 자세교정에 도움이 됩니다.", date: "2024-11-20" },
    { id: 2, title: "OspreyAI로 오늘 바른자세 80번 달성했습니다.", date: "2024-11-18" },
    { id: 2, title: "OspreyAI로 오늘 바른자세 80번 달성했습니다.", date: "2024-11-18" },
    { id: 2, title: "OspreyAI로 오늘 바른자세 80번 달성했습니다.", date: "2024-11-18" },
    { id: 2, title: "OspreyAI로 오늘 바른자세 80번 달성했습니다.", date: "2024-11-18" },
    { id: 2, title: "OspreyAI로 오늘 바른자세 80번 달성했습니다.", date: "2024-11-18" },
    { id: 2, title: "OspreyAI로 오늘 바른자세 80번 달성했습니다.", date: "2024-11-18" },
    { id: 2, title: "OspreyAI로 오늘 바른자세 80번 달성했습니다.", date: "2024-11-18" },
    { id: 2, title: "OspreyAI로 오늘 바른자세 80번 달성했습니다.", date: "2024-11-18" }
  ]);

  const handlePostClick = (id) => {
    navigate(`/Board/${id}`);
  };

  const handleNewPost = () => {
    navigate("/Board/new");
  };

  return (
    <div className="board-container">
      <h1 className="board-title">게시판</h1>
      <button className="new-post-button" onClick={handleNewPost}>
        게시글 작성
      </button>
      <ul className="board-list">
        {posts.map((post) => (
          <li key={post.id} className="board-item" onClick={() => handlePostClick(post.id)}>
            <span className="board-item-title">{post.title}</span>
            <span className="board-item-date">{post.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Board;
