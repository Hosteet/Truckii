import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Home from './pages/Home';
import ResetPassword from './components/Login/ResetPassword';
import ConfirmPassword from './components/Login/ConfirmPassword';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:resetToken" element={<ConfirmPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
