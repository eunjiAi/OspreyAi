// src/pages/notice/NoticeUpdate.js
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; //이전 페이지에서 전달온 값을 받기 위함
import apiClient from "../../utils/axios";
import styles from "./NoticeEdit.module.css";
import { AuthContext } from "../../AuthProvider";

const NoticeEdit = () => {
  const { accessToken } = useContext(AuthContext);
  const { id } = useParams(); // URL 에서 no 파라미터를 가져옴(추출함)
  const navigate = useNavigate(); // 페이지 이동용

  //폼 데이터에 대한 상태 변수 지정
  const [formData, setFormData] = useState({
    noticeNo: "",
    nTitle: "",
    nWriter: "",
    nNickname: "",
    nContent: "",
    ofileName: "",
    rfileName: "",
  });
  //첨부할 파일은 formData 와 별개로 지정함
  const [file, setFile] = useState(null); //변경된 첨부파일

  const [error, setError] = useState(null); //에러 메세지 저장용 상태 변수 선언과 초기화

  //수정할 공지 데이터 불러오기
  useEffect(() => {
    //서버측에 요청해서 해당 공지글 가져오는 ajax 통신 처리 함수를 작성할 수 있음
    const fetchNoticeDetail = async () => {
      try {
        // url path 와 ${변수명} 를 같이 사용시에는 반드시 빽틱(``)을 표시해야 함 (작은따옴표 아님 : 주의)
        const response = await apiClient.get(`/notice/${id}`);
        console.log(response.data);

        //form 의 초기값으로 지정
        setFormData({
          noticeNo: response.data.noticeNo,
          nTitle: response.data.ntitle,
          nWriter: response.data.nwriter,
          nNickname: response.data.nnickname,
          nContent: response.data.ncontent,
          ofileName: response.data.ofileName,
          rfileName: response.data.rfileName,
        }); //서버측에서 받은 데이터 저장 처리
        console.log(formData);
      } catch (error) {
        setError("공지사항 정보 불러오기 실패!");
        console.error(error);
      }
    };

    //작성된 함수 실행
    fetchNoticeDetail();
  }, [id]);

  //input 태그의 입력값값 변경 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? (checked ? "Y" : "N") : value,
    }));
  };

  //파일 변경 처리
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // input 에서 선택한 파일명을 file 변수에 적용함
  };

  // 수정 처리 요청
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지 (submit 이벤트 취소함)

    const data = new FormData();
    data.append("noticeNo", formData.noticeNo);
    data.append("nTitle", formData.nTitle);
    data.append("nWriter", formData.nWriter);
    data.append("nNickname", formData.nNickname);
    data.append("nContent", formData.nContent);
    data.append("rfileName", formData.rfileName);
    data.append("ofileName", formData.ofileName);
    if (file) {
      data.append("ofile", file); // 첨부파일 추가
    }

    try {
      //post 와 put 은 전송방식이 다르므로 같은 url 로 전송해도 구분됨
      // 주의 : put 전송시에는 url 에 id(pk) 에 해당하는 값도 같이 전송해야 함
      await apiClient.put(`/notice/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`, // accessToken 추가
        },
      });

      alert("새 공지글 수정 성공");
      // 공지글 수정이 성공되면 공지 상세보기 페이지로 이동
      navigate(`/notice/${id}`);
    } catch (error) {
      console.error("공지글 수정 실패", error);
      alert("새 공지글 수정 실패");
    }
  };

  if (error) {
    return <div className={styles.error}>{error}</div>; // 에러 메시지 표시
  }

  return (
    <div className={styles.container}>
      <h2> {id}번 공지사항 수정</h2>
      <form
        onSubmit={handleSubmit}
        enctype="multipart/form-data"
        className={styles.form}
      >
        <table
          id="outer"
          align="center"
          width="700"
          cellspacing="5"
          cellpadding="5"
        >
          <tbody>
            <tr>
              <th width="120">번 호</th>
              <td>
                <input
                  type="text"
                  id="noticeNo"
                  name="noticeNo"
                  size="50"
                  value={formData.noticeNo}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <th width="120">제 목</th>
              <td>
                <input
                  type="text"
                  id="nTitle"
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
                  id="nNickname"
                  name="nNickname"
                  value={formData.nNickname}
                  readonly
                />
              </td>
            </tr>
            <tr>
              <th>첨부파일</th>
              <td>
                <input type="file" name="file" onChange={handleFileChange} />
                {formData.ofileName && (
                  <div>
                    <span>현재 파일 : {formData.ofileName}</span>
                  </div>
                )}
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
              <th colspan="2">
                <input type="submit" value="수정완료" /> &nbsp;
                <input
                  type="reset"
                  value="취소"
                  onClick={() => navigate(`/notice/${id}`)}
                />
              </th>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default NoticeEdit;
