// src/routers/qnaRouter.js
import React from 'react';
import { Route } from 'react-router-dom';

import QuestionDetail from '../pages/qna/QuestionDetail';
import QuestionWrite from '../pages/qna/QuestionWrite';
import QuestionUpdate from '../pages/qna/QuestionUpdate';


const qnaRouter = [    
    <Route path="/question/detail/:qno" element={<QuestionDetail />} />,
    <Route path="/question/update/:qno" element={<QuestionUpdate />} />,
    <Route path="/question/write" element={<QuestionWrite />} />,
];

export default qnaRouter;