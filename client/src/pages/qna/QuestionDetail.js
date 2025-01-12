// src/pages/qna/QnaDetail.js
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; //이전 페이지에서 전달온 값을 받기 위함
import apiClient from "../../utils/axios";
import styles from "./QuestionDetail.module.css";
import { AuthContext } from "../../AuthProvider";
import Modal from "../../components/common/Modal";
import AnswerWrite from "./AnswerWrite";

const QuestionDetail = () => {
  const { qno } = useParams(); // URL 에서 no 파라미터를 가져옴(추출함)
  const navigate = useNavigate(); //useNavigate 훅 사용
  const [question, setQuestion] = useState(null); //게시글 데이터 저장할 상태 변수 선언과 초기화함
  const [answers, setAnswers] = useState([]); //댓글 데이터 상태 관리
  const [error, setError] = useState(null); //에러 메세지 저장용 상태 변수 선언과 초기화

  // 모달 처리용
  const [showModal, setShowModal] = useState(false);
  // 댓글 | 대댓글 등록 타겟 변수
  const [answerTarget, setAnswerTarget] = useState(null);

  // 댓글 | 대댓글 수정 상태 관리
  const [editingAnswer, setEditingAnswer] = useState(null); //수정중인 댓글 변호(ID) 저장
  const [editingTitle, setEditingTitle] = useState(""); //수정 중인 댓글 제목 저장용
  const [editingContent, setEditingContent] = useState(""); //수정 중인 댓글 내용 저장용

  const { isLoggedIn, userid, role, accessToken } = useContext(AuthContext); //AuthProvider 에서 가져오기

  useEffect(() => {
    // 게시글 및 댓글 데이터 요청청
    const fetchQnaDetail = async () => {
      console.log("no : " + qno);
      try {
        // 서버측에서 해당 게시글 데이터를 요청
        const response = await apiClient.get(`/question/detail/${qno}`);
        setQuestion(response.data.question); //서버측에서 받은 데이터 저장 처리
        setAnswers(response.data.answerList); // 댓글 데이터 저장
        console.log(response.data.question);
        console.log(response.data.answerList);
      } catch (error) {
        setError("질문 상세 조회 실패!");
        console.error(error);
      }
    };

    //작성된 함수 실행
    fetchQnaDetail();
  }, [qno]);

  // 모달창 열기 함수
  const openModal = ({ qno, ano = null }) => {
    setAnswerTarget({ qno, ano });
    setShowModal(true);
  };

  // 모달창 닫기 함수
  const closeModal = () => {
    setShowModal(false);
    setAnswerTarget(null);
    window.location.reload(); // 페이지 새로고침 추가
  };

  const handleMoveEdit = () => {
    navigate(`/question/update/${qno}`);
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await apiClient.delete(`/question/${qno}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // accessToken 추가
          },
        });
        alert("삭제가 완료되었습니다.");
        navigate("/qna"); //목록 출력 페이지로 이동
      } catch (error) {
        console.error("Delete error : ", error);
        alert("삭제 실패!");
      }
    }
  };

  const handleAnswerDelete = async (ano) => {
    if (window.confirm("답변을 삭제하시겠습니까?")) {
      try {
        await apiClient.delete(`/answer/${ano}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // accessToken 추가
          },
        });
        setAnswers((prevAnswers) =>
          prevAnswers.filter((answer) => answer.ano !== ano)
        );
        alert("답변이 삭제되었습니다.");

        window.location.reload();
      } catch (error) {
        alert("답변 삭제에 실패했습니다.");
      }
    }
  };

  // 댓글 | 대댓글 수정 버튼 클릭시, 제목과 내용이 input 으로 변경 처리하는 핸들러
  const handleAnswerEdit = (ano, atitle, acontent) => {
    setEditingAnswer(ano);
    setEditingTitle(atitle);
    setEditingContent(acontent);
  };

  // 댓글 | 대댓글 수정하고 저장 버튼 클릭시 작동할 핸들러
  const handleSaveAnswerEdit = async (ano) => {
    try {
      await apiClient.put(
        `/answer/${ano}`,
        {
          ano: ano,
          atitle: editingTitle,
          acontent: editingContent,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setAnswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer.ano === ano
            ? { ...answer, atitle: editingTitle, acontent: editingContent }
            : answer
        )
      );
      setEditingAnswer(null);
      alert("답변이 수정되었습니다.");
    } catch (error) {
      alert("답변 수정에 실패했습니다.");
    }
  };

  if (!question) {
    return <div className={styles.loading}>로딩 중...</div>; // 로딩 표시
  }

  if (error) {
    return <div className={styles.error}>{error}</div>; // 에러 메시지 표시
  }

  return (
    <div className={styles.pageBackground}>
      <div className={styles.detailContainer}>
        <h2 className={styles.questionTitle}>{question.qtitle}</h2>
        <table className={styles.questionTable}>
          <tbody>
            <tr>
              <th>작성자</th>
              <td>{question.qwriter}</td>
            </tr>
            <tr>
              <th>등록날짜</th>
              <td>{question.qdate}</td>
            </tr>
            <tr>
              <th>내용</th>
              <td>{question.qcontent}</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.actionButton} ${styles.backButton}`}
            onClick={() => navigate(-1)}
          >
            뒤로가기
          </button>
          {isLoggedIn && userid === question.qwriter && question.answerYn === "N" ? (
            <>
              <button
                className={`${styles.actionButton} ${styles.editButton}`}
                onClick={handleMoveEdit}
              >
                수정
              </button>
              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => handleDelete()}
              >
                삭제
              </button>
            </>
          ) : (
            isLoggedIn &&
            role === "ADMIN" &&
            question.answerYn === "N" && (
              <button
                className={`${styles.actionButton} ${styles.answerButton}`}
                onClick={() => openModal({ qno: question.qno })}
              >
                답변하기
              </button>
            )
          )}
        </div>
        <h3 className={styles.answerSectionTitle}>댓글</h3>
        <table className={styles.answerTable}>
          <thead>
            <tr>
              <th>작성자</th>
              <th>제목</th>
              <th>내용</th>
              <th>등록날짜</th>
              <th>수정|삭제</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((answer) => (
              <tr
                key={answer.ano}
                className={
                  answer.replyLev === 2 ? styles.replyIndented : styles.replyItem
                }
              >
                <td>{answer.awriter}</td>
                <td>
                  {editingAnswer === answer.ano ? (
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                    />
                  ) : (
                    answer.atitle
                  )}
                </td>
                <td>
                  {editingAnswer === answer.ano ? (
                    <input
                      type="text"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />
                  ) : (
                    answer.acontent
                  )}
                </td>
                <td>{answer.adate}</td>
                <td>
                  {isLoggedIn &&
                    userid === answer.awriter &&
                    (editingAnswer === answer.ano ? (
                      <button onClick={() => handleSaveAnswerEdit(answer.ano)}>
                        저장
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            handleAnswerEdit(
                              answer.ano,
                              answer.atitle,
                              answer.acontent
                            )
                          }
                        >
                          수정
                        </button>
                        <button onClick={() => handleAnswerDelete(answer.ano)}>
                          삭제
                        </button>
                      </>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 답변 등록 모달창 */}
      {showModal && (
        <Modal onClose={closeModal}>
          <AnswerWrite
            qno={answerTarget.qno}
            ano={answerTarget.ano}
            onAnswerAdded={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}; // const QuestionDetail

export default QuestionDetail;
