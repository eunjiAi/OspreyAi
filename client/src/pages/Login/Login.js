import React, { useState } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in with', email, password);
    navigate('/dashboard'); // 로그인 후 리다이렉트
  };

  const handleFaceLogin = () => {
    console.log('Face login clicked');
    navigate('/FaceLogin'); // Face 로그인 페이지로 이동
  };

  return (
    <div className="login-container">
      <section className="login-box">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">로그인</button>
        </form>
        <button className="face-login-button" onClick={handleFaceLogin}>
          Face로 로그인
        </button>
        <p className="signup-prompt">
          회원가입이 아직인가요? <Link to="/signup" className="signup-link"> 회원가입</Link>
        </p>
      </section>
    </div>
  );
}

export default Login;
