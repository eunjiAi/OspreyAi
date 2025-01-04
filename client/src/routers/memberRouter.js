import React from "react";
import { Route } from "react-router-dom";

import Signup from "../pages/signup/Signup";
import MyPage from "../pages/mypage/MyPage";
import MyPageMain from "../pages/mypage/MyPageMain";
import PasswordChange from "../pages/mypage/PasswordChange";
import QnA from "../pages/mypage/QnA";
import Withdrawal from "../pages/mypage/Withdrawal";
import MyPageUpdate from "../pages/mypage/MyPageUpdate";
import FaceIdRegister from "../pages/faceid/FaceIdRegister";
import FaceId from "../pages/member/login/FaceId";
import Login from "../pages/member/login/Login";

const memberRouter = [
  <Route path="/signup" element={<Signup />} />,
  <Route path="/login" element={<Login />} />,
  <Route path="/faceid" element={<FaceId />} />,
  <Route path="/faceIdRegister" element={<FaceIdRegister />} />,
  <Route path="/mypage" element={<MyPage />}>
    <Route path="/mypage/mypageMain" element={<MyPageMain />} />
    <Route path="/mypage/password-change" element={<PasswordChange />} />
    <Route path="/mypage/qna" element={<QnA />} />
    <Route path="/mypage/withdrawal" element={<Withdrawal />} />
    <Route path="/mypage/mypageUpdate" element={<MyPageUpdate />} />
  </Route>,
];

export default memberRouter;
