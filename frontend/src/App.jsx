import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login/Login'
import './App.css'
import Home from './pages/Home'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route exact path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
