import React from "react";
import { Route } from "react-router-dom";

import SquatFeedback from "../pages/squatFeedback/SquatFeedback";

const squatFeedbackRouter = [
   <Route path="/squatFeedback" element={<SquatFeedback />} />,
];

export default squatFeedbackRouter;
