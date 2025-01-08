import React from "react";
import { Route } from "react-router-dom";

import Signup from "../pages/signup/Signup";
import FaceIdRegister from "../pages/faceid/FaceIdRegister";
import FaceIDLogin from "../pages/member/login/FaceIDLogin";
import Login from "../pages/member/login/Login";
import FindId from "../pages/member/login/FindId";
import FindPassword from "../pages/member/login/FindPassword";

const memberRouter = [
  <Route path="/signup" element={<Signup />} />,
  <Route path="/faceIDLogin" element={<FaceIDLogin />} />,
  <Route path="/login" element={<Login />} />,
  <Route path="/findId" element={<FindId />} />,
  <Route path="/findPassword" element={<FindPassword />} />,
  <Route path="/faceIdRegister" element={<FaceIdRegister />} />,
];

export default memberRouter;
