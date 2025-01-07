import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/axios';
import styles from './FaqList.module.css';
import PagingView from '../../components/common/PagingView';
import { AuthContext } from '../../AuthProvider';

function FaqList() {
  const [Faqs, setFaqs] = useState([]);
  const [pagingInfo, setPagingInfo] = useState({
    currentPage: 1,
    maxPage: 1,
    startPage: 1,
    endPage: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('질문 TOP');

  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchFaqs = async (page, category = '') => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/faq?page=${page}&category=${category}`);
      setFaqs(response.data.list);
      setPagingInfo(response.data.paging);
    } catch (err) {
      setError('자주하는질문 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs(1, selectedCategory);
  }, [selectedCategory]);

  const handlePageChange = async (page) => {
    fetchFaqs(page, selectedCategory);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchFaqs(1, category); // 카테고리 필터링된 데이터 요청
  };

  const handleTitleClick = (faqId) => {
    navigate(`/faq/${faqId}`);
  };

  const handleWriteClick = () => {
    navigate('/faqw');
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.faqContainer}>
      <h1 className={styles.title}>자주 하는 질문</h1>
      <div className={styles.headerButtons}>
        {role === 'ADMIN' && <button onClick={handleWriteClick}>글쓰기</button>}
      </div>

      <div className={styles.mainContent}>
        {/* 왼쪽 사이드바 (카테고리) */}
        <div className={styles.sidebar}>
          <ul className={styles.categoryList}>
            {['질문 TOP', '회원정보', '피드백'].map((category) => (
              <li
                key={category}
                className={`${styles.categoryItem} ${
                  selectedCategory === category ? styles.activeCategory : ''
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* 오른쪽 컨텐츠 (리스트) */}
        <div className={styles.content}>
          <ul className={styles.faqList}>
            {Faqs.map((faq) => (
              <li key={faq.faqId} className={styles.faqItem}>
                <span
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={() => handleTitleClick(faq.faqId)}
                >
                  {faq.faqTitle}
                </span>
              </li>
            ))}
          </ul>

          {/* 페이징 뷰 */}
          <PagingView
            currentPage={pagingInfo.currentPage || 1}
            maxPage={pagingInfo.maxPage || 1}
            startPage={pagingInfo.startPage || 1}
            endPage={pagingInfo.endPage || 1}
            onPageChange={(page) => handlePageChange(page)}
          />
        </div>
      </div>
    </div>
  );
}

export default FaqList;
