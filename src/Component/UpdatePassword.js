
import { useState, useEffect, useRef, useContext} from "react";
import axios from "axios";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink} from 'react-router-dom';
import Cookies from 'js-cookie';
import AuthContext from "../context/AuthProvider";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const UpdatePassword =()=>{

    const { baseURL } = useContext(AuthContext);

    const errRef = useRef();

    const [user, setUser] = useState('');
    const [tempAuthToken, setTempAuthToken] = useState('');

    const getCookie = (name, tempAuth) => {
        const value1 = Cookies.get(name);
        const value2 = Cookies.get(tempAuth);
        setUser(value1);
        setTempAuthToken(value2);
    };

    const [errMsg, setErrMsg] = useState('');

    const [newPwdStatus, setNewPwdStatus] =useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showMatchPass, setShowmatchPass] = useState(false);

    useEffect(()=>{
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);

    },[pwd, matchPwd]);

    useEffect(()=>{
        getCookie('userEmailForUpdatePassword', 'user_temp_auth_token' );
    });

    const handleEyeIconPass =()=>{
        setShowPassword((prev)=>
            prev == true ? false : true
        )
    }

    const handleEyeIconMatchPass =()=>{
        setShowmatchPass((prev)=>
            prev == true ? false : true
        )
    }

    const handleSubmit = async (e)=>{

        e.preventDefault();

        console.log(user, 'username');
        console.log(tempAuthToken, 'temp auth token');

        const UPDATE_PASSWORD = `https://${baseURL}/wp-json/custom/v1/update-password`;
        const HEADER = {'Content-Type' : 'application/json'};
        const BODY = {
            "username_or_email" : user,
            "temp_auth_token" : tempAuthToken,
            "new_password" : pwd
        }

        try{
            const response = await axios.post(UPDATE_PASSWORD, BODY,{
                headers:HEADER
            });

            setNewPwdStatus(true);
            console.log(response);
            

        }catch(err){

            console.log(err);

            if(!err?.response){
            setErrMsg('No server response');
            }else if(err.response.status === 404){
                setErrMsg('User not found.')
            }else if(err.response.status === 400){
                setErrMsg('Invaild entry, Try again.');
            }

        }
    }

    return(

        <>

        {newPwdStatus? (

            <section>
            <h1>Password has been updated.</h1>
            <br />
            <NavLink to='/login'>Login</NavLink>
            </section>
        ): (

            <section>
            <p ref={errRef} className={errMsg? "errmsg" : "offscreen"} aria-live="assertive"> {errMsg} </p>
            <h1>Update Password</h1>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="password">
                        New Password:
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
                        Confirm New Password:
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

                <button disabled={!validPwd || !validMatch ? true : false}>Update Password</button>

            </form>
        </section>

        )}
        </>
    )
}
export default UpdatePassword;