import React, { useState, useEffect, useContext} from 'react';
import { db} from '../../firebase';
import image from "../../styles/1.png"
import { UserContext } from '../../contexts/UserContext.jsx';


function Friend(props) {
  const {currentUser} = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  async function unfriend() {
    if(window.confirm("Do you really want to unfriend this person?")){
        try {
            setLoading (true);
            await db.collection('users').doc(`${currentUser.uid}`).collection("friends").doc(`${props.docId}`).delete();
            await db.collection('users').doc(`${props.docId}`).collection("friends").doc(`${currentUser.uid}`).delete();
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }
    
}
  return (
    <div className='request'> 
      <div className='userCard '>
                  <div className="img">    <img src={image} width="40" height="40" />   </div>
                  <div className="desc"> 
                    <div className="nameOfUser"> {props.name} </div>
                    <div className="email"><label>{props.email}</label></div>
                  </div>
      </div>
        <button className = "yellow btnSize" onClick={unfriend}>Unfriend</button>
     </div>
  )
}

export default Friend