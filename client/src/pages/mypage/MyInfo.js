import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../AuthProvider';  // 로그인 상태 관리 context
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/axios';
import styles from './MyInfo.module.css';
import PagingView from '../../components/common/PagingView';

function MyInfo() {
  const [notices, setNotices] = useState([]); // 공지사항
  const [faqs, setFaqs] = useState([]); // FAQ
  const [boards, setBoards] = useState([]); // 게시글
  const [selectedCategory, setSelectedCategory] = useState('notice');  // 기본 카테고리 설정
  const [pagingInfo, setPagingInfo] = useState({ currentPage: 1, maxPage: 1, startPage: 1, endPage: 1 });
  const { userid } = useContext(AuthContext);  // 로그인된 유저의 userid
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // 게시글 클릭 시 처리
  const handleTitleClick = (category, postId) => {
    if (category === 'board') {
      navigate(`/board/detail/${postId}`); // board 카테고리일 경우
    } else {
      navigate(`/${category}d/${postId}`); // 그 외의 카테고리는 기존 형식
    }
  };

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);  // 선택된 카테고리로 상태 변경
  };

  // 게시글, FAQ, 공지사항을 가져오는 함수
  const fetchPosts = async (page, category, userid) => {
    setLoading(true);
    try {
      let response;
      const limit = 10; // 한 페이지에 보여줄 항목 개수
      const offset = (page - 1) * limit;  // 첫 페이지는 0부터 시작
  
      // 각 카테고리에 대해 API 요청
      if (category === 'notice') {
        response = await apiClient.get('/notice', {
          params: { page, limit, offset }
        });
        const filteredNotices = response.data.list.filter(notice => notice.noticeWriter === userid);
        setNotices(filteredNotices);
      } else if (category === 'faq') {
        response = await apiClient.get('/faq', {
          params: { page, limit, offset }
        });
        const filteredFaqs = response.data.list.filter(faq => faq.faqWriter === userid);
        setFaqs(filteredFaqs);
      } else if (category === 'board') {
        response = await apiClient.get('/board', {
          params: { page, limit, offset }
        });
        const filteredBoards = response.data.list.filter(board => board.boardWriter === userid);
        console.log(filteredBoards); // 여기에 데이터가 제대로 들어오는지 확인
        setBoards(filteredBoards);
      }
  
      // 페이징 정보 설정
      setPagingInfo(response.data.paging);  // 페이징 정보 받기
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (userid) {
      fetchPosts(1, selectedCategory, userid);  // 페이지 1에서 시작
    }
  }, [userid, selectedCategory]);  // userid, selectedCategory가 변경될 때마다 호출

  // 페이지 변경 시 데이터 재요청
  const handlePageChange = (page) => {
    fetchPosts(page, selectedCategory, userid);
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className={styles.myInfoContainer}>
      <h1>내가 쓴 글</h1>
      <div className={styles.mainContent}>
        {/* 사이드바 (카테고리 선택) */}
        <div className={styles.sidebar}>
          <ul className={styles.categoryList}>
            {['notice', 'faq', 'board'].map((category) => (
              <li
                key={category}
                className={`${styles.categoryItem} ${selectedCategory === category ? styles.activeCategory : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category === 'notice' && '공지사항'}
                {category === 'faq' && 'FAQ'}
                {category === 'board' && '게시글'}
              </li>
            ))}
          </ul>
        </div>
  
        {/* 선택된 카테고리별 데이터 테이블 */}
        <div className={styles.content}>
          {selectedCategory === 'notice' && (
            <div className={styles.section}>
              <ul className={styles.list}>
                {notices.map((notice) => (
                  <li key={notice.noticeNo} className={styles.listItem}>
                    <span
                      onClick={() => handleTitleClick('notice', notice.noticeNo)}
                      style={{ color: 'blue', cursor: 'pointer' }}
                    >
                      {notice.noticeTitle}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
  
          {selectedCategory === 'faq' && (
            <div className={styles.section}>
              <ul className={styles.list}>
                {faqs.map((faq) => (
                  <li key={faq.faqId} className={styles.listItem}>
                    <span
                      onClick={() => handleTitleClick('faq', faq.faqId)}
                      style={{ color: 'blue', cursor: 'pointer' }}
                    >
                      {faq.faqTitle}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
  
          {selectedCategory === 'board' && (
            <div className={styles.section}>
              <ul className={styles.list}>
                {boards.map((board) => (
                  <li key={board.boardNum} className={styles.listItem}>
                    <span
                      onClick={() => handleTitleClick('board', board.boardNum)}
                      style={{ color: 'blue', cursor: 'pointer' }}
                    >
                      {board.boardTitle}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
  
      {/* 페이징 뷰 */}
      <PagingView
        currentPage={pagingInfo.currentPage}
        maxPage={pagingInfo.maxPage}
        startPage={pagingInfo.startPage}
        endPage={pagingInfo.endPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default MyInfo;
