import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login/Login'
import './App.css'
import Home from './pages/Home'
import ResetPassword from './components/Login/ResetPassword'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route exact path='/home' element={<Home />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
