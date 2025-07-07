import Home from './pages/Home';
import { Routes,Route } from "react-router-dom"
import Login from './pages/Login ';
import EmailVerify from './pages/EmailVerify';
import ResetPass from './pages/ResetPass';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {


  return (
    <div>
        <ToastContainer />
          <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/email-verify" element={<EmailVerify/>}/>
          <Route path="/reset-password" element={<ResetPass/>}/>
        </Routes>
    </div>
  )
}

export default App
