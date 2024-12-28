import React from "react";
import { Route } from "react-router-dom";

import Signup from "../pages/Signup/Signup";
import MyPage from "../pages/MyPage/MyPage";
import MyPageUpdate from "../pages/MyPage/MyPageUpdate";
import FaceLogin from "../pages/Login/FaceLogin";
import Login from "../pages/member/Login/Login";

const memberRouter = [
  <Route path="/Signup" element={<Signup />} />,
  <Route path="/Login" element={<Login />} />,
  <Route path="/FaceLogin" element={<FaceLogin />} />,
  <Route path="/MyPage" element={<MyPage />} />,
  <Route path="/MyPageUpdate" element={<MyPageUpdate />} />,
];

export default memberRouter;
