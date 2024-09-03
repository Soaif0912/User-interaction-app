
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Component/Register';
import Login from './Component/Login';
import Home from './Component/Home';
import ProtectedRoute from './Component/ProtectedComponent';
import ForgotPassword from './Component/ForgotPassword';
import VerifyOTP from './Component/VerifOTP';
import UpdatePassword from './Component/UpdatePassword';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/sing-up" element={<Register/>}> </Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path="Forgot-password" element={<ForgotPassword/>}></Route>
          <Route path='/VerifyOTP' element={<VerifyOTP/>}></Route>
          <Route path='/UpdatePassword' element={<UpdatePassword/>}></Route>
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/Home" element={<ProtectedRoute><Home/></ProtectedRoute>}></Route>
          <Route path="/" element={<Navigate to="/Home"/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
