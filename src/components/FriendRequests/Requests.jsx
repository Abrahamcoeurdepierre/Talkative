import React, { useState, useEffect, useContext} from 'react';
import { db} from '../../firebase';
import { UserContext } from '../../contexts/UserContext.jsx';
import image from "../../styles/1.png"
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

function Requests(props) {
  const {currentUser} = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  async function reject() {
    try {
        setLoading (true);
        await db.collection('users').doc(`${currentUser.uid}`).collection("receivedFriendRequests").doc(`${props.docId}`).delete();
        await db.collection('users').doc(`${props.docId}`).collection("sentFriendRequests").doc(`${currentUser.uid}`).delete();
        setLoading(false);
    } catch (error) {
        console.log(error);
    }
}


async function accept() {

      setLoading (true);
      await db.collection('users').doc(`${currentUser.uid}`).collection("friends").doc(props.docId).set({
          name: props.name,
          email: props.email,
          interactedAt: firebase.firestore.FieldValue.serverTimestamp()

      }).catch(error => {
        console.log(error);
      });
      await db.collection('users').doc(`${props.docId}`).collection("friends").doc(currentUser.uid).set({
        name: currentUser.displayName,
        email: currentUser.email,
        interactedAt: firebase.firestore.FieldValue.serverTimestamp()

    }).catch(error => {
      console.log(error);
    });
      reject();
      setLoading(false);


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

        <button className='yellow' onClick={reject}>Reject</button>
        <button onClick={accept}>Accept</button>

     </div>
    
  )
}

export default Requests