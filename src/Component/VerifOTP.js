
import React, { useState, useEffect, useContext } from 'react';
import OtpInput from 'react-otp-input';
import LoaderComp from './Loader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import AuthContext from '../context/AuthProvider';


const VerifyOTP =()=>{

    const {baseURL } = useContext(AuthContext);

    const setCookieWithAuthTokenExpiry = (name, value) => {
        const date = new Date();
        date.setTime(date.getTime() + 15 * 60 * 1000); // 15 minutes in milliseconds
        Cookies.set(name, value, { expires: date });
    };

    const navigate = useNavigate();

    const [cookieValue, setCookieValue] = useState('');
    const getCookie = (name) => {
        const value = Cookies.get(name);
        setCookieValue(value);
    };

    const [otp, setOtp] = useState('');
    const [loader, setLoader] =useState(false);
    const [errMsg, setErrMsg] =useState('');

    const verifyOTP = async()=>{

        setLoader(true);

        console.log(cookieValue, 'UserName');

        const OTP_VERIFY_URL = `https://${baseURL}/wp-json/custom/v1/verify-otp`;
        console.log(OTP_VERIFY_URL)
        const HEADER = {'Content-Type' : 'application/json'};
        const BODY = {
            "username_or_email": cookieValue,
            "otp": otp
        }

        try{
            const response = await axios.post(OTP_VERIFY_URL, BODY,{
                headers:HEADER
            });

            setCookieWithAuthTokenExpiry('user_temp_auth_token',response.data.temp_auth_token);
            setLoader(false);
            setOtp('');
            console.log(response);
            response.data.status === 200 &&  navigate('/UpdatePassword');

        }catch(err){

            console.log(err);
            // setOtp('');
            setLoader(false);

            if(!err?.response){
            setErrMsg('No server response');
            }else if(err.response.status === 404){
                setErrMsg('User not found.')
            }else if(err.response.status === 400){
                setErrMsg('OTP invalid or expired.');
            }

        }
    }

    useEffect( ()=>{

        getCookie('userEmailForUpdatePassword');
        console.log(otp);
        setErrMsg('');

        if(otp.length === 6){
            verifyOTP();
        }else{
            setLoader(false);
        }

    },[otp]);

    return(
        <section>
        
        <h1>VerifOTP</h1>
        <p>we have send a OTP to your mail id.</p>
        <p  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <form className='otpform'>
            <label>Enter OTP:</label>
            <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
            />

        </form>

        {loader && <LoaderComp loaderType="spinner-default" loaderColor="white" loaderSize="100" /> }
        </section>
    )
}
export default VerifyOTP;