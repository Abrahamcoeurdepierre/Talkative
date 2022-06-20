import React from 'react';
import firebase from "firebase/compat/app"
import {auth} from "../firebase.js";
import {useNavigate} from "react-router-dom"
import logo from "../styles/logo.png"
import google from "../styles/google.png"



function SignIn() {
    let navigate = useNavigate();
    const sign = () => {    
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
        navigate("/");
    }
    return (
        <div className="signInCard">
            <div className="logo">
                <img src={logo} width="170" height="100" />
            </div>
            <div className="welcome">Please log in to chat with your friends</div>
            <div className='button'>
                <button onClick={sign}>
                    <div className="google"><img src={google} width="35" height="35" /></div>
                        <div className="buttonText">Sign/Log in with Google</div>
                    </button>
            </div>
            
        </div>
    );
}

export default SignIn






