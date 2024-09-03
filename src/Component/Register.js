
import { useState, useEffect, useRef, useContext} from "react";
import axios from "axios";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  NavLink, Route} from 'react-router-dom';
import AuthContext from "../context/AuthProvider";
import LogOut from './LogOut';
import LoadingBar from 'react-top-loading-bar';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const Register =()=>{

    const { auth, baseURL } = useContext(AuthContext);

    const userref = useRef();
    const errRef = useRef();

    const [loginStatus, setLoginStatus] = useState(false);

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showMatchPass, setShowmatchPass] = useState(false);

    const [buttonSubmit, setButtonSubmit] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(()=>{
        userref.current.focus();
        if(auth.token && auth.username){
            setLoginStatus(true);
        }
    },[])

    useEffect(()=>{
        if(auth.token && auth.username){
            setLoginStatus(true);
        }else{
            setLoginStatus(false);
        }
    },[auth])

    useEffect(()=>{
        setValidName(USER_REGEX.test(user));
    },[user]);

    useEffect(()=>{
        setValidEmail(EMAIL_REGEX.test(email));
    },[email]);

    useEffect(()=>{
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    },[pwd, matchPwd]);

    const handleSubmit = async (e)=>{
        e.preventDefault();

        const v1 = USER_REGEX.test(user);
        const v2 = EMAIL_REGEX.test(email);
        const v3 = PWD_REGEX.test(pwd);

        if(!v1 || !v2 || !v3){
            console.log("Invaild Entry");
            return;
        }
    
        const data = {
            "username" : user,
            "password" : pwd,
            "email" : email
        }

        setProgress(85);
        setButtonSubmit(true);

        try{
            const APIres = await axios.post(`https://${baseURL}/wp-json/wp/v2/users/register`, data,{
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            // console.log(JSON.stringify(APIres));
            console.log(APIres.data);
            console.log(APIres.status);
            setProgress(100);
            setUser("");
            setEmail('');
            setPwd("");
            setMatchPwd("");
            setSuccess(true);
            setButtonSubmit(false);

        }catch(err){

            if(!err?.response){
                setErrMsg("No Server Response");
            }else if(err?.response.status === 422){
                setErrMsg("User already exists");
            }else if(err?.response.status === 405){
                setErrMsg("Missing required fields");
            }else{
            setErrMsg("Reagistration Faild"); 
            }
            console.log(err);
            setProgress(100);
            setButtonSubmit(false);;

        }
    }

    const handleEyeIconPass =()=>{
        setShowPassword((prev)=>
            prev === true ? false : true
        )
    }

    const handleEyeIconMatchPass =()=>{
        setShowmatchPass((prev)=>
            prev === true ? false : true
        )
    }

    return(
        <>
            {

            
            success? (
                <section>
                    <h1> Registration Success!</h1>
                        <NavLink to="/login">login</NavLink>
                </section>
            ):(

                loginStatus?(
                    <LogOut/>
                ):(
                    <section>

                        <LoadingBar
                        color='#f11946'
                        progress={progress}
                        onLoaderFinished={() => setProgress(0)}
                        />

                        <p ref={errRef} className={errMsg? "errmsg" : "offscreen"} aria-live="assertive"> {errMsg} </p>
                        <h1>Register</h1>
                        <form onSubmit={handleSubmit}>

                            <div>
                                <label htmlFor="username">
                                    Username:
                                    <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                                </label>
                                <input type="text"
                                    ref={userref}
                                    id="username"
                                    autoComplete="off"
                                    onChange={(e)=>setUser(e.target.value)}
                                    value={user}
                                    required
                                    aria-invalid={validName ? "false" : "true"}
                                    aria-describedby="uidnote"
                                    onFocus={()=>setUserFocus(true)}
                                    onBlur={()=>setUserFocus(false)}
                                />
                                <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    4 to 24 characters.<br />
                                    Must begin with a letter.<br />
                                    Letters, numbers, underscores, hyphens allowed.
                                </p>
                            </div>
                            <div>
                                <label htmlFor="Email">
                                    Email:
                                    <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                                </label>
                                <input type="email"
                                    id="email"
                                    autoComplete="off"
                                    onChange={(e)=>setEmail(e.target.value)}
                                    value={email}
                                    required
                                    aria-invalid={validEmail ? "false" : "true"}
                                    aria-describedby="uidnote"
                                    onFocus={()=>setEmailFocus(true)}
                                    onBlur={()=>setEmailFocus(false)}
                                />
                                <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    Please enter a valid email.<br />
                                    Example : abc123@gmail.com<br />
                                </p>
                            </div>
                            <div>
                                <label htmlFor="password">
                                    Password:
                                    <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                                </label>
                                <div className="input-button">
                                    <input type={showPassword? "text" : "password"}
                                        id="password"
                                        autoComplete="off"
                                        onChange={(e)=>setPwd(e.target.value)}
                                        value={pwd}
                                        required
                                        onFocus={()=>setPwdFocus(true)}
                                    />
                                    <span className="eyebutton" onClick={handleEyeIconPass}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                <p id="uidnote" className={pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    8 to 24 characters.<br />
                                    Must include uppercase and lowercase letters, a number and a special character.<br />
                                    Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                                </p>
                            </div>

                            <div>
                                <label htmlFor="confrm_password">
                                    Confirm Password:
                                    <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                                </label>
                                <div className="input-button">
                                    <input type={showMatchPass? "text" : "password"}
                                        id="matchpassword"
                                        autoComplete="off"
                                        onChange={(e)=>setMatchPwd(e.target.value)}
                                        value={matchPwd}
                                        required
                                        onFocus={()=>setMatchFocus(true)}
                                    >
                                    </input>
                                    <span className="eyebutton" onClick={handleEyeIconMatchPass}>
                                        {showMatchPass ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    Must match the first password input field.
                                </p>
                            </div>


                            <button disabled={!validName || !validEmail || !validPwd || !validMatch || buttonSubmit ? true : false}>Sing Up</button>
                        </form>

                        <div>
                            <p>Already registered?<br/>
                                <span className="line">
                                        <NavLink to="/login">Sing In</NavLink>
                                </span>
                            </p>
                        </div>

                    </section>
                )
            )}
        </>
    )
}
export default Register;


