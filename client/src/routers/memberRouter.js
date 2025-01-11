import React from "react";
import { Route } from "react-router-dom";

import FaceIdRegister from "../pages/faceid/FaceIdRegister";
import FaceIDLogin from "../pages/member/login/FaceIDLogin";
import Login from "../pages/member/login/Login";
import FindId from "../pages/member/login/FindId";
import FindPassword from "../pages/member/login/FindPassword";
import NaverCallback from "../pages/member/login/NaverCallback";

const memberRouter = [
  <Route path="/faceIDLogin" element={<FaceIDLogin />} />,
  <Route path="/login" element={<Login />} />,
  <Route path="/findId" element={<FindId />} />,
  <Route path="/findPassword" element={<FindPassword />} />,
  <Route path="/faceIdRegister" element={<FaceIdRegister />} />,
  <Route path="/naver/callbackUi" element={<NaverCallback />} />,
];

export default memberRouter;
