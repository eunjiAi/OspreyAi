import React from "react";
import { Route } from "react-router-dom";

import MyPage from "../pages/mypage/MyPage";
import MyPageMain from "../pages/mypage/MyPageMain";
import PasswordChange from "../pages/mypage/PasswordChange";
import Withdrawal from "../pages/mypage/Withdrawal";
import MyPageUpdate from "../pages/mypage/MyPageUpdate";
import MyInfo from "../pages/mypage/MyInfo";
import MypageAdmin from "../pages/mypage/MypageAdmin";

const mypageRouter = [
  <Route path="/mypage" element={<MyPage />}>
    <Route path="/mypage/mypageMain" element={<MyPageMain />} />
    <Route path="/mypage/password-change" element={<PasswordChange />} />
    <Route path="/mypage/myinfo" element={<MyInfo />} />
    <Route path="/mypage/withdrawal" element={<Withdrawal />} />
    <Route path="/mypage/mypageUpdate" element={<MyPageUpdate />} />
    <Route path="/mypage/mypageAdmin" element={<MypageAdmin />} />
  </Route>,
];

export default mypageRouter;
