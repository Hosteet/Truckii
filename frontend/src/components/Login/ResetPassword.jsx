import { useState } from 'react';
import Logo from '../../assets/Logo.svg';
import LoginImage from '../../assets/loginImage.png';
import TextSlider from '../TextSlider/TextSlider';
import '../../App.css';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Handle success message or display it to the user
        window.location.href = '/reset-password/:resetToken'; // Redirect to confirm password page
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
          <form className="form-container" onSubmit={handleResetPassword}>
            <h1 className="formHeading">Reset Password</h1>
            <p className="sign-in">Enter your email to reset your password</p>
            <div className="form-fields">
              <input
                className="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <p className="error">{error}</p>}
              <button className="sign-in-button" type="submit">
                Reset Password
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
