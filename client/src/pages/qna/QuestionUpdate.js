// src/pages/qna/QnaDetail.js
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; //이전 페이지에서 전달온 값을 받기 위함
import apiClient from "../../utils/axios";
import styles from "./QuestionUpdate.module.css";
import { AuthContext } from "../../AuthProvider";

const QuestionUpdate = () => {
  const { qno } = useParams(); // URL 에서 no 파라미터를 가져옴(추출함)
  const navigate = useNavigate(); // 페이지 이동용

  const { accessToken } = useContext(AuthContext);

  //폼 데이터에 대한 상태 변수 지정
  const [formData, setFormData] = useState({
    qno: "",
    qtitle: "",
    qwriter: "",
    qcontent: "",
    qdate: "",
  });

  const [error, setError] = useState(null); //에러 메세지 저장용 상태 변수 선언과 초기화

  //수정할 게시글 데이터 불러오기
  useEffect(() => {
    //서버측에 요청해서 해당 게시글 가져오는 ajax 통신 처리 함수를 작성할 수 있음
    const fetchQuestionUpdate = async () => {
      try {
        // url path 와 ${변수명} 를 같이 사용시에는 반드시 빽틱(``)을 표시해야 함 (작은따옴표 아님 : 주의)
        const response = await apiClient.get(`/question/detail/${qno}`);
        console.log(response.data);

        //form 의 초기값으로 지정
        setFormData({
          qno: response.data.question.qno,
          qtitle: response.data.question.qtitle,
          qwriter: response.data.question.qwriter,
          qcontent: response.data.question.qcontent,
          qdate: response.data.question.qdate,
        }); //서버측에서 받은 데이터 저장 처리
        console.log(formData);
      } catch (error) {
        setError("게시글 정보 불러오기 실패!");
        console.error(error);
      }
    };

    //작성된 함수 실행
    fetchQuestionUpdate();
  }, [qno]);

  //input 태그의 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // 수정 처리 요청
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지 (submit 이벤트 취소함)

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    try {
      //post 와 put 은 전송방식이 다르므로 같은 url 로 전송해도 구분됨
      // 주의 : put 전송시에는 url 에 id(pk) 에 해당하는 값도 같이 전송해야 함
      await apiClient.put(`/question/${qno}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`, // accessToken 추가
        },
      });

      alert("질문 수정 성공");
      // 답변 수정이 성공되면 게시글 상세보기 페이지로 이동
      // navigate(`/question/detail/${qno}`);
      navigate("/qna");
    } catch (error) {
      console.error("질문 수정 실패", error);
      alert("질문 수정 실패");
    }
  };

  if (error) {
    return <div className={styles.error}>{error}</div>; // 에러 메시지 표시
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.header}> {qno}번 질문글 수정</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <table className={styles.table}
        >
          <tbody>
            <tr>
              <th>번 호</th>
              <td>
                <input
                  type="text"
                  id="qno"
                  name="qno"
                  value={formData.qno}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <th>제 목</th>
              <td>
                <input
                  type="text"
                  id="qtitle"
                  name="qtitle"
                  value={formData.qtitle}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>작성자</th>
              <td>
                <input
                  type="text"
                  id="qwriter"
                  name="qwriter"
                  value={formData.qwriter}
                  readonly
                />
              </td>
            </tr>
            <tr>
              <th>내 용</th>
              <td>
                <textarea className={styles.textarea}
                  name="qcontent"
                  value={formData.qcontent}
                  onChange={handleChange}
                  required
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <div className={styles.buttongroup}>
          <button 
            className={styles.submit} 
            onClick={handleSubmit}
          >
            수정완료
          </button>
          &nbsp;
          <button
            className={styles.reset}
            onClick={() =>
              setFormData({
                ...formData,
                qtitle: "",
                qcontent: "",
              })
            }
          >
            초기화
          </button>
          &nbsp;
          <button
            className={styles.back}
            onClick={() => navigate(-1)}
          >
            취소
          </button>
      </div>
    </div>
  );
};

export default QuestionUpdate;
