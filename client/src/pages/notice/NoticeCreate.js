import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import styles from "./NoticeCreate.module.css";
import { AuthContext } from "../../AuthProvider";

function NoticeCreate() {
  const { userid, accessToken } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nTitle: "",
    nWriter: userid || "",
    nNickname: "",
    nContent: "",
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

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
            nNickname: response.data || masked,
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
    data.append("nWriter", userid);
    data.append("nNickname", formData.nNickname);
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
      <h1 className={styles.header}>공지글 등록</h1>
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
                placeholder="공지제목을 입력하세요."
                required
              />
              </td>
            </tr>
            <tr>
              <th width="120">작성자</th>
              <td>
                <input
                  type="text"
                  name="nNickname"
                  value={formData.nNickname}
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
                placeholder="공지내용을 입력하세요."
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
                <input type="submit" value="등록하기" 
                onClick={(handleSubmit)}/> &nbsp;
                <input
                  type="reset"
                  value="작성 초기화"
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
                  value="등록취소"
                  onClick={() => navigate(-1)}
                />
           </div>
        </div>
    </div>
  );
}

export default NoticeCreate;
