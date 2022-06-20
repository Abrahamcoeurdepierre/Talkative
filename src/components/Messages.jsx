import React from 'react'
import Message from './Message';
import { useState, useEffect, useRef, useContext} from 'react';
import { db} from '../firebase';
import SendMessage from './SendMessage';
import {useParams} from "react-router-dom"
import { UserContext } from '../contexts/UserContext.jsx';
import image from "../styles/1.png"



function Messages() {
  const scrolling = useRef(null);
    let{userId} = useParams();
    const[userName, setUserName] = useState([]);
    const {currentUser: currUser} = useContext(UserContext);
    const [sentmessages, setSentmessages] = useState([]);
    const [gotmessages, setGotmessages] = useState([]);
    let unsubMessages, unsubMessages2; 
      
    const getFriend = () => {
        db.collection('users').doc(`${currUser.uid}`).collection("friends").doc(userId).update({
            read: "true"
        });  
    }
    const getSentMessages = () => {

        unsubMessages =  db.collection('messages').where("sender","==",currUser.uid)
        .where("receiver","==",userId).orderBy("date","desc").limit(7).onSnapshot(snapshot => {
        setSentmessages(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
            
          });
          
         unsubMessages2 =  db.collection('messages').where("sender","==",userId)
        .where("receiver","==",currUser.uid).orderBy('date',"desc").limit(7).onSnapshot(snapshot => {
        setGotmessages(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        });

        db.collection('users').where("__name__","==",userId)
        .onSnapshot(snapshot => {
        setUserName(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        });
  }
  useEffect(() => {
    getSentMessages();
    return () => {
      unsubMessages();
      unsubMessages2();
    };
   }, [currUser, userId]);

   useEffect(() => {
    getFriend();
   });
   useEffect(() => {
    scrolling.current?.scrollIntoView({behavior: "smooth"});
   }, [gotmessages, sentmessages]);

    const newAr = gotmessages.concat(sentmessages);
    var name  = '';
  if(userName[0]!= null){
      name = userName[0].Name;
  }

  
   if (typeof newAr[0] != "undefined") {

     for (let index = 0; index < newAr.length; index++) {
          if(newAr[index].date== null){
            newAr[index].date = [{
              seconds: 0,
              nanoseconds:0
            }];
          } 
       
     }
       newAr.sort((a, b) => a.date.seconds -b.date.seconds);
   }
  return (
    <div>
      <div className='userCard noMargin'>
                <div className="img">    <img src={image} width="40" height="40" />   </div>
                <div className="desc"> 
                  <div className="nameOfUser"> {name} </div>
                </div>
        </div> 
      <div className="bigMessageBox">
        <div className='messageBox'>
                
                {newAr.map((message) => {
                            return <Message  key = {message.id}
                                            content = {message.content}
                                            context = {message.context}
                                            receiver = {message.receiver}
                                            sender = {message.sender}
                                            date = {message.date}
                                            currUser = {currUser.uid}
                                            />   
                            
                })}
                <div ref={scrolling}/>
            </div>
            <div className="messageFooter">
              <SendMessage userId= {userId}/>
            </div>
            
        </div>
     

    </div>
    
  )
}

export default Messages;