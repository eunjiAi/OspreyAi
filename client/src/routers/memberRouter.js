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
import FaceIDLogin from "../pages/member/login/FaceIDLogin";
import Login from "../pages/member/login/Login";
import MyInfo from "../pages/mypage/MyInfo";
import MypageAdmin from "../pages/mypage/MypageAdmin";
import FindId from "../pages/member/login/FindId";
import FindPassword from "../pages/member/login/FindPassword";

const memberRouter = [
  <Route path="/signup" element={<Signup />} />,
  <Route path="/faceIDLogin" element={<FaceIDLogin />} />,
  <Route path="/login" element={<Login />} />,
  <Route path="/findId" element={<FindId />} />,
  <Route path="/findPassword" element={<FindPassword />} />,
  <Route path="/faceIdRegister" element={<FaceIdRegister />} />,
  <Route path="/mypage" element={<MyPage />}>
    <Route path="/mypage/mypageMain" element={<MyPageMain />} />
    <Route path="/mypage/password-change" element={<PasswordChange />} />
    <Route path="/mypage/myinfo" element={<MyInfo />} />
    <Route path="/mypage/qna" element={<QnA />} />
    <Route path="/mypage/withdrawal" element={<Withdrawal />} />
    <Route path="/mypage/mypageUpdate" element={<MyPageUpdate />} />
    <Route path="/mypage/mypageAdmin" element={<MypageAdmin />} />
  </Route>,
];

export default memberRouter;
