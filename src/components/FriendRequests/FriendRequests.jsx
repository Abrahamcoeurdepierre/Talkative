import React, { useState, useEffect, useContext} from 'react';
import { db} from '../../firebase';
import { UserContext } from '../../contexts/UserContext.jsx';
import Requests from './Requests';

function FriendRequests() {
  // User Auth
  const {currentUser} = useContext(UserContext);
  const [lastData, setLastData] = useState(0);
  const [firstData, setFirstData] = useState(0);
  const limit = 5;
  let unsub, unsubFetchNext, unsubFetchPrevious
  const [requests, setRequests] = useState([]);
  const getRequests =  () => {
    unsub = db.collection('users').doc(`${currentUser.uid}`).collection("receivedFriendRequests").orderBy("createdAt", "asc").limit(limit).onSnapshot(snapshot => {
    setRequests(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
    if(snapshot.size > 0){
    setLastData(snapshot.docs[snapshot.size - 1]);
    }
    });   
  }

  useEffect(() => {
    getRequests();
    return () =>{
      unsub();
    }
   }, [currentUser]);

   useEffect(() => {
    return () =>{
      unsub();
    }
   }, []);


   const fetchNext = () => {
     if(lastData != 0){
      unsubFetchNext =  db.collection('users').doc(`${currentUser.uid}`).collection("receivedFriendRequests").orderBy("createdAt","asc").startAfter(lastData).limit(limit).get().then(snapshot => {
        if(snapshot.size > 0 ){
            setRequests(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
            setFirstData(snapshot.docs[0])
            setLastData(snapshot.docs[snapshot.size - 1]);
        }

      });
     }
   
}



const fetchPrevious = () => {
  if (firstData != 0) {
    unsubFetchPrevious =  db.collection('users').doc(`${currentUser.uid}`).collection("receivedFriendRequests").orderBy("createdAt","asc").endBefore(firstData).limitToLast(limit).get().then(snapshot => {
      if(snapshot.size > 0){
          setRequests(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
          setFirstData(snapshot.docs[0])
          setLastData(snapshot.docs[snapshot.size - 1])
      }
      
    });
  }
 

}

  return (
    <div className="wrapper">

      <div className='wrap bigSize'>
        <div className="title">
          Friend Requests: 
        </div>
            {requests.map((request) => {
                        return <Requests key ={request.id}
                                    name = {request.name}
                                    email = {request.email}
                                    docId = {request.id}
                                    />
                                
                  })}
            <button onClick={fetchPrevious} className={`grey requestBtn`} > Prev</button>
          <button onClick={fetchNext} className={`grey requestBtn`}> Next</button>
      </div>

    </div>

  
  )
}

export default FriendRequests