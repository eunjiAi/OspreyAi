import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home/Home';
import Header from './common/Header/Header'; 
import Footer from './common/Footer/Footer';
import SquatFeedback from './pages/SquatFeedback/SquatFeedback';
import './App.css';

function App() {
  return (
    <Router>
      <Header /> 
      
      <Routes>
       
        <Route path="/" element={<Home />} />
        <Route path="/SquatFeedback" element={<SquatFeedback />} />


      </Routes>

      <Footer /> 
    </Router>
  );
}

export default App;
