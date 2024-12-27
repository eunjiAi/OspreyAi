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
        faqContent: '',
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
        if(name === 'answerContent'){
            setAnswerContent(value);
        }
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,

        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 방지 (submit 이벤트 취소함)

        const data = new FormData();
        data.append('faqTitle', formData.faqTitle);
        data.append('faqWriter', formData.faqWriter);
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
        <h1 className={styles.header}>자주하는 질문 등록 페이지</h1>
        <form 
            onSubmit={handleSubmit}
            enctype="multipart/form-data"
            className={styles.form}>
            <table id="outer" align="center" width="700" cellspacing="5" cellpadding="5">   
                <tbody>
                <tr><th width="120">제 목</th>
                    <td>
                        <input 
                            type="text" 
                            name="faqTitle" 
                            size="50"
                            value={formData.faqTitle}
                            onChange={handleChange}
                            required />         
                    </td></tr>
                <tr><th width="120">작성자</th>
                    <td>
                        <input 
                            type="text" 
                            name="faqWriter" 
                            value={formData.faqWriter}
                            readonly />         
                    </td></tr>
                <tr><th>질문 내용</th>
                    <td><textarea 
                            rows="5" 
                            cols="50" 
                            name="faqContent"
                            value={formData.faqContent}
                            onChange={handleChange}
                            required
                            ></textarea>
                    </td></tr>
                <tr><th>답변 내용</th>
                <td><textarea 
                        rows="5" 
                        cols="50" 
                        name="answerContent"
                        value={answerContent}
                        onChange={handleChange}
                        required
                        ></textarea>
                </td></tr>
                <tr><th colspan="2">
                    <input type="submit" value="등록하기" /> &nbsp; 
                    <input type="reset" value="작성취소" 
                        onClick={() => setFormData({ ...formData, faqContent: ''})} />{' '} &nbsp;
                    <input 
                        type="button" 
                        value="목록" 
                        onClick={() => {
                            navigate(-1);   //자바스크립트의 history.go(-1); 과 같음
                        }} />
                </th></tr>
                </tbody>
            </table>
            </form>
        </div>
    );
}

export default FaqWrite;
