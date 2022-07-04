import React, { useState, useEffect}  from 'react';
import firebase from "firebase/compat/app"
import {auth} from "../firebase.js";
import {useNavigate} from "react-router-dom"
import logo from "../styles/logo.png"
import google from "../styles/google.png"
import Welcome from './Welcome.jsx';
import {Link} from "react-router-dom"
import Error from './Error.jsx';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState();
    const [loading, setLoading] = useState(false);

    let navigate = useNavigate();
    const sign = () => {   
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then(() => {
            navigate("/");
        });
        
    }

    const emailLogin = (e) => {
        e.preventDefault();
        setErrors("");
        setLoading(true);
            auth.signInWithEmailAndPassword(email, password).then(() => {
                if (!auth.currentUser.emailVerified) {
                    auth.signOut();
                }
                setLoading(false);
            }).catch((error) => {
                setErrors("There is an error while logging in. Please Try again and make sure your password and email are correct")
                setLoading(false);
            });
       

    }
    return (
        <div className="Landing-Card">
            <Welcome/>
            <div className="rightDiv">
                <div className="Card">
                    <div className="logo">
                        <img src={logo} width="170" height="100" />
                        <h2>Sign In</h2>
                        {errors && <Error errors = {errors}/>}
                    </div>
                    <form onSubmit={emailLogin}>
                        <div className="username">
                            <h5>
                                Email: 
                            </h5>
                            <input type="email" placeholder='Please input your email here' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="password">
                            <h5>
                                Password: 
                            </h5>
                            <input type="password" placeholder='Please input your password here' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        <button type='submit' className={loading.toString()}>
                            LOG IN
                        </button>
                    </form>
                    {/* <Link to={'/forgotpass'} className="noStyle">
                        <h5>
                            Forgot Password?
                        </h5>
                    </Link> */}
                    
                    <Link to={'/createaccount'} className="noStyle">
                        <h5>
                            Create an account
                        </h5>
                    </Link>
                    
                    <div className='button'>
                        <button onClick={sign}>
                            <div className="google"><img src={google} width="35" height="35" /></div>
                                <div className="buttonText">Sign/Log in with Google</div>
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default SignIn






