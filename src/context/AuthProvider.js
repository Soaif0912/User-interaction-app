import { createContext, useState, useContext } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const baseURL = "arcscope.weavers-web.com";

    const [auth, setAuth] = useState({
        "token": localStorage.getItem('loginapp_login_token'),
        "username": localStorage.getItem('loginapp_username')
    });

    const [isLogin, setIsLogin] = useState(auth.token && auth.username ? true : false);
            
    return (
        <AuthContext.Provider value={{ auth, setAuth, isLogin, setIsLogin, baseURL}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext =()=>{ useContext(AuthContext)}

export default AuthContext;
