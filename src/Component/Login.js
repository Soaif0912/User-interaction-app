
import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "../context/AuthProvider";
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

const LOGIN_URL = 'https://riqueza.weavers-web.com/wp-json/jwt-auth/v1/token';

const Login = () => {

    const navigate = useNavigate();

    const { auth, setAuth, isLogin, setIsLogin, baseURL } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [buttonSubmit, setButtonSubmit] = useState(false);
    const [forgotPWD, setForgotPWD] = useState(false);

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if(!success){
            userRef.current.focus();
        }
        setSuccess(auth.token && auth.username ? true : false);
        console.log(auth);
        if(success){
            navigate('/Home');
        }
    }, [])

    useState(()=>{
        setSuccess(auth.token && auth.username ? true : false);
    },[auth])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleEyeIconPass = () => {
        setShowPassword((prev) =>
            prev == true ? false : true
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const logindata = {
            'username': user,
            'password': pwd
        }

        setButtonSubmit(true);
        setProgress(85);

        try {
            const response = await axios.post(`https://${baseURL}/wp-json/jwt-auth/v1/token`, logindata, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log(JSON.stringify(response));
            setAuth({
                "token": response.data.token,
                "username": response.data.user_nicename
            });
            setIsLogin(true);

            localStorage.setItem('loginapp_login_token', response.data.token);
            localStorage.setItem('loginapp_username', response.data.user_nicename);

            setSuccess(true);
            setButtonSubmit(false);
            setProgress(100);
            navigate('/Home');

        } catch (err) {
            if(!err?.response ){
                setErrMsg("No server response");
            }else if(err?.response.status == 403){
                setErrMsg("Username and Password did not match");
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            if(err?.response){
                setForgotPWD(true);
            }
            setButtonSubmit(false);
            setProgress(100);

        }

    }

    return (
        <>
            <section>

                <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
                />

                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Sign In</h1>
                
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <div className='input-button'>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <span className="eyebutton" onClick={handleEyeIconPass}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button className="form_button" disabled={buttonSubmit ? true : false} > 
                            Sing In
                    </button>
                </form>

                {forgotPWD == true  &&
                <p>
                    Don't remember password 
                    <span className='line'>
                        <NavLink to='/Forgot-password'>Forgot Password</NavLink>
                    </span>
                </p>
                }

                <p>
                    Need an Account?<br />
                    <span className="line">
                        {/*put router link here*/}
                        <NavLink to='/sing-up'>Sign Up</NavLink>
                    </span>
                </p>

            </section>

        </>
    )
}

export default Login

