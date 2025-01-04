import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import logoImage from '../../images/logo.png';

function Home() {
    return (
        <div className="home-container">
            <section className="hero">
                <h1 className="hero-title">OspreyAI</h1>
                <p className="hero-description">실시간 스쿼트피드백 AI</p>
            </section>
            <section className="features">
                <Link to="/SquatFeedback" className="feature">
                    <div className="feature-icon">
                        <img src={logoImage} alt="AI Process" />
                    </div>
                    <h2 className="feature-title">SquatFeedback AI</h2>
                    <p className="feature-description">OspreyAI</p>
                </Link>
            </section>
        </div>
    );
}

export default Home;
