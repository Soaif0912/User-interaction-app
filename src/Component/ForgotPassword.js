
import { useState, useRef, useEffect, useContext } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import LoadingBar from 'react-top-loading-bar';
import  AuthContext  from "../context/AuthProvider";

const EMAIL_REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const ForgotPassword =()=>{

    const { baseURL } = useContext(AuthContext);

    const setCookieWithExpiry = (name, value) => {
        const date = new Date();
        date.setTime(date.getTime() + 20 * 60 * 1000); // 20 minutes in milliseconds
        Cookies.set(name, value, { expires: date });
    };
      

    const navigate = useNavigate();

    const emailRef = useRef();
    const errRef= useRef();

    const [errMsg, setErrMsg] = useState('');

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [progress, setProgress] = useState(0);

    useEffect(()=>{
        setValidEmail(EMAIL_REGEX.test(email));
    },[email])

    useEffect(()=>{
        setErrMsg('');
    },[email]);

    const handleSubmit = async (e)=>{
        e.preventDefault();

        setProgress(85);
        setCookieWithExpiry('userEmailForUpdatePassword', email);

        const OPT_GET_URL = `https://${baseURL}/wp-json/custom/v1/initiate-otp`;
        try{
            const response = await axios.post(OPT_GET_URL,{"username_or_email":email},{
                headers:{'Content-Type' : 'application/json'}
            });
            setProgress(100);
            navigate('/VerifyOTP');
            
        }catch(err){
            console.log(err);
            if(!err?.response){
                setErrMsg('No server response');
            }else if(err?.response.status == 404){
                setErrMsg("User not found");
            }
            setProgress(100);
        }
    }

    return(
        <section>

            <LoadingBar
            color='#f11946'
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
            />

            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Update Password</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="Email">
                        Enter your email:
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

                <button disabled={validEmail? false : true}>Receive OTP</button>
            </form>
        </section>
    )
}
export default ForgotPassword;