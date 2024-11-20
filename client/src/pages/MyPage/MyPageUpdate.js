import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPageUpdate.css";

const MyPageUpdate = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("정보가 업데이트되었습니다!");
    navigate("/");
  };

  const handleDelete = () => {
    alert("계정이 삭제되었습니다!");
    navigate("/");
  };

  return (
    <div className="update-container">
      <h1 className="update-title">정보 수정</h1>
      <form className="update-form" onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            placeholder="이름 입력"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            placeholder="이메일 입력"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
            placeholder="비밀번호 입력"
          />
        </div>
        <div className="button-group">
          <button type="submit" className="save-btn">저장하기</button>
          <button type="button" onClick={handleDelete} className="delete-btn">
            계정 삭제
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyPageUpdate;
