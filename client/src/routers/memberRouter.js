import React from "react";
import { Route } from "react-router-dom";

import Signup from "../pages/signup/Signup";
import MyPage from "../pages/mypage/MyPage";
import MyPageUpdate from "../pages/mypage/MyPageUpdate";
import FaceIdRegister from "../pages/faceid/FaceIdRegister";
import FaceId from "../pages/member/login/FaceId";
import Login from "../pages/member/login/Login";

const memberRouter = [
  <Route path="/signup" element={<Signup />} />,
  <Route path="/login" element={<Login />} />,
  <Route path="/faceid" element={<FaceId />} />,

  <Route path="/FaceIdRegister" element={<FaceIdRegister />} />,
  <Route path="/mypage" element={<MyPage />} />,
  <Route path="/mypageUpdate" element={<MyPageUpdate />} />,
];

export default memberRouter;
