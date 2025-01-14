import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import styles from "./PostsCreate.module.css"
import { AuthContext } from "../../AuthProvider";

function PostsCreate() {
  const { userid, accessToken } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    writer: userid || "",
    nickname: "",
    content: "",
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // 닉네임 가져오기
  useEffect(() => {
    const fetchNickname = async () => {
      const masked = userid.includes("@")
        ? `${userid.split("@")[0]}@*`
        : userid;
      if (userid) {
        try {
          const response = await apiClient.get(`/member/nickname`, {
            params: { userid },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setFormData((prevFormData) => ({
            ...prevFormData,
            nickname: response.data || masked,
          }));
        } catch (error) {
          console.error("닉네임 조회 실패", error);
          alert("닉네임을 조회할 수 없습니다.");
        }
      }
    };

    fetchNickname();
  }, [userid, accessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 첫 번째 공백을 허용하지 않음 (첫 번째 공백이 있으면 제거)
    let updatedValue = value;
    if (updatedValue.startsWith(' ') || updatedValue.startsWith('\n')) {
      updatedValue = updatedValue.trimStart();
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: updatedValue,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("writer", formData.writer);
    data.append("nickname", formData.nickname);
    data.append("content", formData.content);
    if (file) {
      data.append("ofile", file);
    }

    try {
      await apiClient.post("/posts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert("게시글 등록 성공");
      navigate("/posts");
    } catch (error) {
      console.error("게시글 등록 실패", error);
      alert("게시글 등록 실패");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>게시글 등록</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <th>제 목</th>
              <td>
                <input
                  type="text"
                  name="title"
                  size="50"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="게시판제목을 입력하세요."
                  required
                />
              </td>
            </tr>
            <tr>
              <th>작성자 닉네임</th>
              <td>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <th>첨부파일</th>
              <td>
                <input type="file" name="file" onChange={handleFileChange} />
              </td>
            </tr>
            <tr>
              <th>내 용</th>
              <td>
                <textarea className={styles.textarea}
                  rows="5"
                  cols="50"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="게시판내용을 입력하세요."
                  required
                ></textarea>
              </td>
            </tr>
            <tr>
            </tr>
          </tbody>
        </table>
      </form>
      <div>
        <div className={styles.buttongroup}>
              <button 
                className={styles.submit} 
                onClick={handleSubmit}
              >
                등록하기
              </button>
              &nbsp;
              <button
                className={styles.reset}
                onClick={() =>
                  setFormData({
                    ...formData,
                    title: "",
                    content: "",
                  })
                }
              >
                작성 초기화
              </button>
              &nbsp;
              <button
                className={styles.back}
                onClick={() => navigate(-1)}
              >
                등록취소
              </button>
          </div>
        </div>
    </div>
  );
}

export default PostsCreate;
