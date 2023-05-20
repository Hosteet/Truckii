import { useState } from 'react';
import TextSlider from '../TextSlider/TextSlider';
import Logo from '../../assets/Logo.svg';
import LoginImage from '../../assets/loginImage.png';
import '../../App.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Handle success, e.g., save token to localStorage, redirect user, etc.
        window.location.href = '/'; // Redirect to home page
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('An error occurred during the fetch request');
    }
  };

  return (
    <section className="login-container">
      <div className="left-section">
        <div className="logo">
          <img src={Logo} alt="" />
        </div>
        <div>
          <form className="form-container" onSubmit={handleLogin}>
            <h1 className="formHeading">Log In</h1>
            <p className="sign-in">Sign in to continue</p>
            <div className="form-fields">
              <input
                className="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="error">{error}</p>}
              <p className="forgot">Forgot Password?</p>
              <button className="sign-in-button" type="submit">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="right-section">
        <img src={LoginImage} alt="" />
        <TextSlider />
      </div>
    </section>
  );
}
