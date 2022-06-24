import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Loja from "./pages/Loja"
import LoginPage from "./pages/LoginPage"
import Admin from "./pages/Admin"
import EditProduct from "./pages/EditProduct"
import Registration from "./pages/Registration"

// const PrivateRoute = ({children, redirectTo}) => {
//   const isAuthenticated = localStorage.getItem("token") !== null;
//   console.log("isAuth: ", isAuthenticated);
//   return (isAuthenticated) ? children : <Navigate to={redirectTo} />;
// }



export default function App() {
  return (
    <div>
      <Router>
        <div>
          <nav className="navbar">
          
              
                <Link to="/" className="navItem">Login</Link>
              
              
                <Link to="/loja" className="navItem">Loja</Link>
              
              
                <Link to="/registration" className="navItem">Registro</Link>
              
              
                <Link to="/Admin" className="navItem">Admin</Link>

                <a className="navItem" href="javascript:localStorage.clear();location='/'">Logout</a>
              
          </nav>
  
          <Routes>
            <Route path="/" element={<LoginPage />}>
            </Route>
            <Route path="/loja"element={<Loja />}>
            </Route>
            <Route path="/registration"element={<Registration />}>
            </Route>
            <Route path="/admin"element={<Admin />}>
            </Route>
            <Route path="/editar"element={<EditProduct />}>
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}


// path="/store" element={
//   <PrivateRoute redirectTo="/">
//     <Home />
//   </PrivateRoute>