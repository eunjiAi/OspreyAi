import React from "react";
import { Route } from "react-router-dom";

import SquatFeedback from "../pages/SquatFeedback/SquatFeedback";

const squatFeedbackRouter = [
   <Route path="/SquatFeedback" element={<SquatFeedback />} />,
];

export default squatFeedbackRouter;
