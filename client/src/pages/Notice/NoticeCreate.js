import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import styles from "./NoticeCreate.css";
import { AuthContext } from "../../AuthProvider";

function NoticeCreate() {
  const { email, accessToken } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nTitle: "",
    nWriter: "관리자",
    nContent: "",
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        nWriter: email,
      }));
    }
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("nTitle", formData.nTitle);
    data.append("nWriter", formData.nWriter);
    data.append("nContent", formData.nContent);
    if (file) {
      data.append("ofile", file);
    }

    try {
      await apiClient.post("/notice", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert("공지글 등록 성공");
      navigate("/notice");
    } catch (error) {
      console.error("공지글 등록 실패", error);
      alert("공지글 등록 실패");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>공지글 등록 페이지</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <table align="center" width="700" cellspacing="5" cellpadding="5">
          <tbody>
            <tr>
              <th width="120">제 목</th>
              <td>
                <input
                  type="text"
                  name="nTitle"
                  size="50"
                  value={formData.nTitle}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th width="120">작성자</th>
              <td>
                <input
                  type="text"
                  name="nWriter"
                  value={formData.nWriter}
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
                <textarea
                  rows="5"
                  cols="50"
                  name="nContent"
                  value={formData.nContent}
                  onChange={handleChange}
                  required
                ></textarea>
              </td>
            </tr>
            <tr>
              <th colSpan="2">
                <input type="submit" value="등록하기" /> &nbsp;
                <input
                  type="reset"
                  value="작성취소"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      nTitle: "",
                      nContent: "",
                    })
                  }
                />
                &nbsp;
                <input
                  type="button"
                  value="목록"
                  onClick={() => navigate(-1)}
                />
              </th>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default NoticeCreate;
