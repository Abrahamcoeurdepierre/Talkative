import React, {useState} from 'react'
import {Link} from "react-router-dom"
import image from "../styles/1.png"
import { auth} from '../firebase';
import bell from "../styles/bell2.png"

function Users(props) {
  const [email, setEmail] = useState(auth.currentUser.email);
  var className = "NewMess"
    if(props.read != "false"){
      className = "invisibleMess"
    }

    return (

      <div>
        <Link to ={`messages/` + props.id} className="noStyle">
        <div className='userCard'>
                <div className="img">    <img src={image} width="40" height="40" />   </div>
                <div className="desc"> 
                  <div className="nameOfUser"> {props.name} </div>
                  <div className="email"><label>{props.email}</label></div>
                </div>
                <div className={className}>  <img src={bell} width="30" height="30" /> </div>

        </div> 
  
        </Link>
       
  
      </div>
      
    )
  }
 

export default Users;