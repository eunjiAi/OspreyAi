// src/pages/qna/QuestionList.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';  //page 에서 page 바꾸기할 때 사용
import apiClient from '../../utils/axios';
import styles from './QuestionList.module.css';  //게시글 목록 출력 페이지에만 적용할 스타일시트 파일
import PagingView from '../../components/common/PagingView';  //PagingView 컴포넌트 임포트
import { AuthContext } from '../../AuthProvider';

// Header.js 에서 받은 list 와 paging 정보르 받아서 랜더링하도록 코드 수정함
function QuestionList({ searchResults }){
  const [question, setQuestion] = useState([]); // 게시글 데이터를 저장할 상태
  const [pagingInfo, setPagingInfo] = useState({
    currentPage: 1,
    maxPage: 1,
    startPage: 1,
    endPage: 1,
  });

  //현재 동작 상태 관리 (list or search)
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [loading, setLoading] = useState(true); // 로딩 상태 관리  
  const [error, setError] = useState(null); // 에러 상태 관리  

  const { isLoggedIn , userid, role } = useContext(AuthContext);  // AuthProvider 에서 가져오기

  const navigate = useNavigate();  //페이지 이동을 위한 navigate 함수 선언함  

  // 서버에서 게시글 목록 (기본 1page) 데이터를 가져오는 함수
  const fetchQuestions = async (page) => {
    try {
      setLoading(true); // 로딩 상태 시작
      const response = await apiClient.get(`/question`, {
        params: { page },
      }); // Spring Boot 서버 URL
      setQuestion(response.data.list); // 응답 데이터를 상태로 설정  //boards = response.data.list; 과 같음
      setPagingInfo(response.data.paging);  //서버에서 제공하는 페이징 정보
      console.log(response.data.paging);
      setIsSearchMode(false);  // 일반 목록 조회 모드 지정
    } catch (err) {
      setError('qna 목록을 불러오는 데 실패했습니다.'); // 에러 메시지 설정

    } finally {
      setLoading(false); // 로딩 상태 종료, loading = false; 과 같음
    }
  };

  //검색 결과가 변경되면 상태 업데이트 코드 추가함 
  // 컴포넌트가 처음 렌더링될 때 fetchNotices 호출
  // window.onload 될때 (jquery.document.ready 과 같음)
  useEffect(() => {
    if(searchResults){
      //검색 결과가 전달되면 검색 모드로 전환 처리함      
      setQuestion(searchResults.list || []);
      setPagingInfo(searchResults.paging || {});
      setIsSearchMode(true);   //검색 모드로 설정
      setLoading(false);
    }else{
      // 초기 로드 또는 일반 조회
      fetchQuestions(1);
    }
  }, [searchResults]);

  //페이지 변경 핸들러 : 클릭한 page 의 목록을 요청 처리함 (일반 목록 페이지 요청 또는 검색 목록 페이지 요청)
  const handlePageChange = async (page) => {
    try{
      setLoading(true);
      if(isSearchMode){
        // 검색 목록 페이지 요청
        const response = await apiClient.get(`/question/search/title`, {
          params: { action: searchResults.action, keyword: searchResults.keyword, page }
        })
        setQuestion(response.data.list || []);
        setPagingInfo(response.data.paging || {});
      } else {
        fetchQuestions(page);  //일반 목록 페이지 요청
      }
    } catch (error){
      setError('페이징 요청 실패!');
    } finally {
      setLoading(false);
    }
    
  };

  // 목록 버튼 클릭시 작동할 함수 (핸들러)
  const handleListButtonClick = () => {
    // 검색 결과 초기화 및 일반 조회로 전환
    setIsSearchMode(false);
    fetchQuestions(1);
  };

  //제목 클릭시 상세보기 이동
  const handleTitleClick = (qno) => {
    // url path 와 ${변수명} 를 같이 사용시에는 반드시 빽틱(``)을 표시해야 함 (작은따옴표 아님 : 주의)
    navigate(`/question/detail/${qno}`);   //상세 페이지로 이동 처리 지정   
    //라우터로 등록함 
  };

  //글쓰기 버튼 클릭시 글쓰기 페이지로 이동동
  const handleWriteClick = () => {
    navigate('/question/write');  //글쓰기 페이지로 이동 처리 지정, 라우터로 등록해야 함
  };

  const getAnswerStatus = (answerYn) => {
    if (answerYn === 'Y') {
      return (
        <span className={styles.answerCompleted}>
          답변완료 ✔
        </span>
      );
    }
    return (
      <span className={styles.answerPending}>
        미답변 ✖
      </span>
    );
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>; // 로딩 표시
  }

  if (error) {
    return <div className={styles.error}>{error}</div>; // 에러 메시지 표시
  }

  return (
    <div className={styles.questionContainer}>
      <h1 className={styles.title}>Q & A</h1>
      {/* 글쓰기 버튼 : 로그인 상태일 때만 표시 */}
      {isLoggedIn && (<button onClick={handleWriteClick}>글쓰기</button> )}
      <button onClick={handleListButtonClick}>새로고침</button>
      <table className={styles.QuestionList}>
        <thead>
            <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>등록일</th>
                <th>답변여부</th>
            </tr>
        </thead>
        <tbody>
        {question.map((question) => (
          <tr key={question.qno}>
            <td>{question.qno}</td>
            <td>
              {/* 로그인 상태이며, 작성자가 자신일때만 링크 동작 */}
              {isLoggedIn && (userid === question.qwriter || role === 'ADMIN') ?
                (<span 
                    style={{color: 'blue', cursor: 'pointer', fontWeight: 'bold'}} 
                    onClick={() => handleTitleClick(question.qno)}  //클릭시 글번호 전달  
                >            
                    {question.qtitle}
                </span>) : (
                  // 이외 상태일때 링크 비동작
                  <span style={{ color: 'gray', textDecoration: 'none'}}>{question.qtitle}</span>
                )
              }
            </td>
            <td>{question.qwriter}</td>
            <td>{question.qdate}</td>
            <td>{getAnswerStatus(question.answerYn)}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <PagingView 
        currentPage={pagingInfo.currentPage || 1}
        maxPage={pagingInfo.maxPage || 1}
        startPage={pagingInfo.startPage || 1}
        endPage={pagingInfo.endPage || 1}
        onPageChange={(page) => handlePageChange(page)}
      />
    </div>
  );
}

export default QuestionList;