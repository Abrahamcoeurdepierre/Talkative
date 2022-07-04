import React, { useState, useEffect}  from 'react';
import firebase from "firebase/compat/app"
import {auth,db} from "../firebase.js";
import {useNavigate} from "react-router-dom"
import logo from "../styles/logo.png"
import google from "../styles/google.png"
import Welcome from './Welcome.jsx';
import {Link} from "react-router-dom"
import Error from './Error.jsx';


function CreateAccount() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let navigate = useNavigate();
    const [errors, setErrors] = useState();
    const [loading, setLoading] = useState(false);

    const createAccount = (e) => {
        e.preventDefault();
        setLoading(true);
        db.collection('users').where("email", "==", email).get().then(snapshot => {
            if (snapshot.docs.length > 0) {
                setLoading(false);
                setErrors("The email is already registered. Please use another email.");
            }
            else{
                auth.createUserWithEmailAndPassword(email,password).then(()=>{
                    auth.currentUser.sendEmailVerification().then(() => {
                        auth.signOut().then(() => {
                            navigate('/sentemail');
                        });
                    }).catch(()=>{
                        setLoading(false);
                        setErrors("The verification email was not sent. Please reload the page");
                    });
                    
                }).catch((error)=>{
                    setLoading(false);
                    setErrors(error.toString());
                }); 
                
            }  
          }).catch(()=>{
                setLoading(false);
                setErrors("There was an error, please reload the website");
          })
    }
    const sign = () => {    
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then(() => {
            navigate("/");
        });
    }
    return (
        <div className="Landing-Card">
            <Welcome/>
            <div className="rightDiv">
                <div className="Card">
                    <div className="logo">
                        <img src={logo} width="170" height="100" />
                        <h2>Create Account</h2>
                        {errors && <Error errors = {errors}/>}
                    </div>
                    <form onSubmit={createAccount}>
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
                            CREATE
                        </button>
                    </form>
                    <Link to={'/'} className="noStyle">
                        <h5>
                            Already have an account? Log In
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

export default CreateAccount