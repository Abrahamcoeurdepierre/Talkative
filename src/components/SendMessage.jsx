import React , {useState} from 'react'
import {auth, db} from "../firebase.js"
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

function SendMessage(props) {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

         

    async function sendMessage(e) {
        e.preventDefault()
        try {
            setLoading (true);
            await db.collection('users').doc(`${props.userId}`).collection("friends").doc(auth.currentUser.uid).update({
                read: "false",
                interactedAt: firebase.firestore.FieldValue.serverTimestamp()
            }); 
            await db.collection('users').doc(`${auth.currentUser.uid}`).collection("friends").doc(props.userId).update({
                interactedAt: firebase.firestore.FieldValue.serverTimestamp()
            }); 
            await db.collection('messages').add({
                content: message,
                receiver: props.userId,
                sender: auth.currentUser.uid,
                date: firebase.firestore.FieldValue.serverTimestamp()
            })
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
        setMessage('');
    }
    
    var load = "Write here";
    if (loading == true) {
        load = "loading"
    }
    else{
        load =  "Write here";
    }


    if (loading) {
        return (
            <div className="lds-facebook"><div></div> <div></div> <div></div></div>
        )
    } else {
        return (
      
            <div className='sendMessage'>
                <form onSubmit={sendMessage} className="form">
                    <div className='textInput' >
                        <input type= "text"placeholder={load} value={message} onChange={(e) => setMessage(e.target.value)} required/>
                    </div>
                    <div className='float'>
                        <button type='submit'>Send</button>
                    </div>
                </form>
                
            </div>
          )
    }
 
}

export default SendMessage