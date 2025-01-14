// src/pages/notice/NoticeWrite.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/axios';
import styles from './FaqWrite.module.css';
import { AuthContext } from '../../AuthProvider';

function FaqWrite() {
    const { userid, accessToken } = useContext(AuthContext); // AuthProvider 에서 가져오기

    const [answerContent, setAnswerContent] = useState("");

    //상태 변수 지정
    const [formData, setFormData] = useState({
        faqTitle: '',
        faqWriter: '', //초기 상태 
        category: '질문 TOP',     
        faqContent: '',
        answerContent: '',
    });

    // 글등록 성공시 'FaqList' 페이지로 이동 처리할 것이므로
    const navigate = useNavigate();

    //페이지가 로딩될 때 (window.onload or jquery.document.ready 와 같음)
    useEffect(() => {   
        setFormData((prevFormData) => ({
            ...prevFormData,
            faqWriter: userid, // AuthProvider 에서 가져온 userid
        }));
        
    }, [userid]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // 첫 번째 문자가 공백이나 엔터인지 확인
        let updatedValue = value;
        if (updatedValue.startsWith(' ') || updatedValue.startsWith('\n')) {
            updatedValue = updatedValue.trimStart(); // 첫 번째 공백 또는 엔터를 제거
        }

        if(name === 'answerContent'){
            setAnswerContent(updatedValue);
        }
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: updatedValue,

        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 방지 (submit 이벤트 취소함)

        const data = new FormData();
        data.append('faqTitle', formData.faqTitle);
        data.append('faqWriter', formData.faqWriter);
        data.append('category', formData.category);
        data.append('faqContent', formData.faqContent);

        try {
            await apiClient.post('/faq', data, {
                params: {
                    'answerContent': answerContent
                },
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${accessToken}`, // accessToken 추가
                }
            });

            alert('자주하는 질문 등록 성공');
            // 자주하는 질문 등록이 성공되면 자주하는 질문 목록 페이지로 이동

            navigate('/faq');
        } catch (error) {
            console.error('자주하는 질문 등록 실패', error);
            alert('자주하는 질문 등록 실패');
        }
    };

    return (
        <div className={styles.container}>
        <h1 className={styles.header}>자주하는 질문 등록</h1>
        <form 
            onSubmit={handleSubmit}
            enctype="multipart/form-data"
            className={styles.form}>
            <table className={styles.table}>   
                <tbody>
                <tr><th>제 목</th>
                    <td>
                        <input 
                            type="text" 
                            name="faqTitle" 
                            size="50"
                            value={formData.faqTitle}
                            onChange={handleChange}
                            placeholder="자주하는 질문 제목을 입력하세요."
                            required />         
                    </td></tr>
                <tr><th>작성자</th>
                    <td>
                        <input 
                            type="text" 
                            name="faqWriter" 
                            value={formData.faqWriter}
                            readonly />         
                    </td></tr>
                <tr><th>카테고리</th>
                    <td>
                        <select
                            type="category"
                            name="category" 
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="질문 TOP">질문 TOP</option>
                            <option value="회원정보">회원정보</option>
                            <option value="피드백">피드백</option>
                        </select>       
                    </td></tr>
                <tr><th>질문 내용</th>
                    <td><textarea className={styles.textarea}
                            name="faqContent"
                            value={formData.faqContent}
                            onChange={handleChange}
                            placeholder="질문 내용을 입력하세요."
                            required
                            ></textarea>
                    </td></tr>
                <tr><th>답변 내용</th>
                <td><textarea className={styles.textarea} 
                        name="answerContent"
                        value={answerContent}
                        onChange={handleChange}
                        placeholder="답변 내용을 입력하세요."
                        required
                        ></textarea>
                </td></tr>
                </tbody>
            </table>
        </form>
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
                {setFormData({
                ...formData,
                faqTitle: '',
                category: '',
                faqContent: '',
                });
                setAnswerContent('');
            }}
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
    );
}

export default FaqWrite;
