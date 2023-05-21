import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Logo from '../../assets/Logo.svg';
import LoginImage from '../../assets/loginImage.png';
import '../../App.css';
import TextSlider from '../TextSlider/TextSlider';
import { useAuth } from '../../providers/AuthProvider';

export default function ConfirmPassword() {
  const { resetToken } = useParams(); // Get the resetToken from the URL params
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [error, setError] = useState('');
  const { confirm_password, error } = useAuth();
  const handleConfirmPassword = async () => {
    await confirm_password({ password, confirmPassword, token: resetToken});
    // try {
    //   const response = await fetch(`http://localhost:5000/api/auth/reset-password/${resetToken}`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({email, password, confirmPassword }), // Remove resetCode from the request body
    //   });

    //   if (response.ok) {
    //     const data = await response.json();
    //     console.log(data);
    //     // Handle success message or display it to the user
    //     window.location.href = '/login'; // Redirect to login page
    //   } else {
    //     const errorData = await response.json();
    //     setError(errorData.message);
    //   }
    // } catch (error) {
    //   console.error('Fetch error:', error);
    //   setError('An error occurred during the fetch request');
    // }
  };

  return (
    <section className="login-container">
      <div className="left-section">
        <div className="logo">
          <img src={Logo} alt="" />
        </div>
        <div>
          <form className="form-container">
            <h1 className="formHeading">Confirm Password</h1>
            <p className="sign-in">Enter your new password</p>
            <div className="form-fields">
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {error && <p className="error">{error}</p>}
              <button className="sign-in-button" type="button" onClick={handleConfirmPassword}>
                Save Password
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
