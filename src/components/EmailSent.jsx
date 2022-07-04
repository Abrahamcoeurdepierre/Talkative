import React from 'react'
import Welcome from './Welcome'
import logo from "../styles/logo.png"
import {useNavigate} from "react-router-dom"



function EmailSent() {
    let navigate = useNavigate();
    const login = () => {
        navigate('/login');
    }
  return (
    <div className="Landing-Card">
        <Welcome/>
        <div className="rightDiv align-middle">
            <div className="Card">
                <div className="logo">
                    <img src={logo} width="170" height="100" />
                        <h2>Email Verification</h2>
                        <h5>Please check your email and click on the link provided there</h5>
                        <br />
                        <br />
                        <button onClick={login}>LOG IN</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EmailSent