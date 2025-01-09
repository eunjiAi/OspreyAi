import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../AuthProvider';  // 로그인 상태 관리 context
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/axios';
import styles from './MyInfo.module.css';
import PagingView from '../../components/common/PagingView';

function MyInfo() {
  const [notices, setNotices] = useState([]); // 공지사항
  const [questions, setQuestions] = useState([]); // QNA
  const [posts, setPosts] = useState([]); // 게시글
  const [selectedCategory, setSelectedCategory] = useState('notice');  // 기본 카테고리 설정
  const [pagingInfo, setPagingInfo] = useState({ currentPage: 1, maxPage: 1, startPage: 1, endPage: 1 });
  const { userid } = useContext(AuthContext);  // 로그인된 유저의 userid
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // 게시글 클릭 시 처리
  const handleTitleClick = (category, Id) => {
    if (category === 'qna') {
      navigate(`/question/detail/${Id}`); // qna 카테고리일 경우
    } else {
      navigate(`/${category}/${Id}`); // 그 외의 카테고리는 기존 형식
    }
  };

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);  // 선택된 카테고리로 상태 변경
  };

  // 게시글, QNA, 공지사항을 가져오는 함수
  const fetchPosts = async (page, category, userid) => {
    setLoading(true);
    try {
      const limit = 10;  // 한 페이지에 보여줄 항목 개수
      let response;
  
      // 각 카테고리에 대해 API 요청 (백엔드에서 필터링된 데이터를 받음)
      if (category === 'notice') {
        response = await apiClient.get('/notice/my', { params: { page, limit, userid } });
        setNotices(response.data.list);
        setPagingInfo(response.data.paging);  // 페이징 정보 받기
      } else if (category === 'qna') {
        response = await apiClient.get('/question/my', { params: { page, limit, userid } });
        setQuestions(response.data.list);
        setPagingInfo(response.data.paging);  // 페이징 정보 받기
      } else if (category === 'posts') {
        response = await apiClient.get('/posts/my', { params: { page, limit, userid } });
        setPosts(response.data.list);
        setPagingInfo(response.data.paging);  // 페이징 정보 받기
      }
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
            {['notice', 'qna', 'posts'].map((category) => (
              <li
                key={category}
                className={`${styles.categoryItem} ${selectedCategory === category ? styles.activeCategory : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category === 'notice' && '공지사항'}
                {category === 'qna' && 'QNA'}
                {category === 'posts' && '게시글'}
              </li>
            ))}
          </ul>
        </div>

        {/* 선택된 카테고리별 데이터 테이블 */}
        <div className={styles.content}>
          {selectedCategory === 'notice' && (
            <div className={styles.section}>
              <ul className={styles.list}>
                {notices.length > 0 ? (
                  notices.map((notice) => (
                    <li key={notice.noticeNo} className={styles.listItem}>
                      <span
                        onClick={() => handleTitleClick('notice', notice.noticeNo)}
                        style={{ color: 'blue', cursor: 'pointer' }}
                      >
                        {notice.ntitle}
                      </span>
                    </li>
                  ))
                ) : (
                  <li>공지사항이 없습니다.</li>  // 데이터가 없을 경우 처리
                )}
              </ul>
            </div>
          )}

          {selectedCategory === 'qna' && (
            <div className={styles.section}>
              <ul className={styles.list}>
                {questions.length > 0 ? (
                  questions.map((question) => (
                    <li key={question.qNo} className={styles.listItem}>
                      <span
                        onClick={() => handleTitleClick('qna', question.qno)}
                        style={{ color: 'blue', cursor: 'pointer' }}
                      >
                        {question.qtitle}
                      </span>
                    </li>
                  ))
                ) : (
                  <li>QNA가 없습니다.</li>  // 데이터가 없을 경우 처리
                )}
              </ul>
            </div>
          )}

          {selectedCategory === 'posts' && (
            <div className={styles.section}>
              <ul className={styles.list}>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <li key={post.postId} className={styles.listItem}>
                      <span
                        onClick={() => handleTitleClick('posts', post.postId)}
                        style={{ color: 'blue', cursor: 'pointer' }}
                      >
                        {post.title}
                      </span>
                    </li>
                  ))
                ) : (
                  <li>게시글이 없습니다.</li>  // 데이터가 없을 경우 처리
                )}
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
