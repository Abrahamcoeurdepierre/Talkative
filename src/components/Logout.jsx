import React from 'react'
import {useNavigate} from "react-router-dom"
import {auth, db} from "../firebase.js";

function Logout() {
    let navigate = useNavigate();
    const log = () => {    
        navigate("/");
        auth.signOut();
    }
  return (
    <button onClick={log}>LOGOUT </button>
  )
}

export default Logout