import React from "react";
import { Route } from "react-router-dom";

import Signup from "../pages/signup/Signup";
import MyPage from "../pages/myPage/MyPage";
import MyPageUpdate from "../pages/myPage/MyPageUpdate";
import FaceLogin from "../pages/login/FaceLogin";
import Login from "../pages/member/login/Login";

const memberRouter = [
  <Route path="/signup" element={<Signup />} />,
  <Route path="/login" element={<Login />} />,
  <Route path="/faceLogin" element={<FaceLogin />} />,
  <Route path="/myPage" element={<MyPage />} />,
  <Route path="/myPageUpdate" element={<MyPageUpdate />} />,
];

export default memberRouter;
