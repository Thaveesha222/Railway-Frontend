import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage";
import TrainLocation from "./TrainLocation"; // Import the page to redirect to

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/train-locations" element={<TrainLocation />} />
      </Routes>
    </Router>
  );
};

export default App;
