import React, { useState, useEffect, useContext} from 'react';
import { db} from '../../firebase';
import { UserContext } from '../../contexts/UserContext.jsx';
import AddFriend from './AddFriend';
import SentRequests from "./SentRequests"
import Friend from './Friend';

function AddFriendsPage() {
  const [hide, setHide] = useState("");
  const [searchData, setSearchData] = useState('');
  const [lastData, setLastData] = useState(0);
  const [firstData, setFirstData] = useState(0);
  let unsub;
  const {currentUser} = useContext(UserContext);
  const [people, setPeople] = useState([]);
  const [friends, setFriends] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const limit = 5;

  const getFriends =  () => {
  unsub = db.collection('users').doc(`${currentUser.uid}`).collection("friends").onSnapshot(snapshot => {
  setFriends(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
  }); 
}
  const getFriendRequests =  () => {
    unsub = db.collection('users').doc(`${currentUser.uid}`).collection("sentFriendRequests").onSnapshot(snapshot => {
    setSentRequests(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }); 
  }
  const getReceivedRequests =  () => {
    unsub = db.collection('users').doc(`${currentUser.uid}`).collection("receivedFriendRequests").onSnapshot(snapshot => {
    setReceivedRequests(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }); 
  }
  const getPeople = () => {
    db.collection('users').where("email", "!=",String(currentUser.email) ).orderBy('email').limit(limit).get().then(snapshot => {
        setPeople(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        if(snapshot.size > 0){
          setLastData(snapshot.docs[snapshot.size - 1]);
          }

    });
 }

 const getSearch = async () => {
  await db.collection('users').orderBy('email').where("email", "!=",String(currentUser.email) ).where("email", "==",searchData ).limit(limit).get().then(snapshot => {
  setPeople(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
  });  
}

 
  // Pagination
   
    
  

const fetchNext = () => {
  if(lastData != 0){
      db.collection('users').orderBy('email').where("email", "!=",String(currentUser.email) ).startAfter(lastData).limit(limit).get().then(snapshot => {
        if(snapshot.size > 0){
            setPeople(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
            setFirstData(snapshot.docs[0])
            setLastData(snapshot.docs[snapshot.size - 1]);
        }

      });
  }
}

const fetchPrevious = () => {
  if(firstData != 0){
      db.collection('users').orderBy('email').where("email", "!=",String(currentUser.email) ).endBefore(firstData).limitToLast(limit).get().then(snapshot => {
      if(snapshot.size > 0){
          setPeople(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
          setFirstData(snapshot.docs[0])
          setLastData(snapshot.docs[snapshot.size - 1])
      }

      });
  }
}


useEffect(() => {
  if (searchData == "") {
    getPeople();
    setHide("");

  } else{
    getSearch();
    setHide("hide");
  }
 }, [currentUser, searchData]);


useEffect(() => {
    getFriends();
    getPeople();
    getFriendRequests();
    getReceivedRequests();
    return () => {
        
    };

}, [currentUser]);



var usersArray = [];
var friendsArray = [];
var receivedArray = [];
var requestsArray = [];
var friendsPrint = [];
var requestPrint = [];
receivedRequests.map((person) => {
  receivedArray.push(person.id)
 })
sentRequests.map((person) => {
  requestsArray.push(person.id)
 })

friends.map((person) => {
 friendsArray.push(person.id)
})

people.map((person) => {
  if (friendsArray.includes(person.id) == false 
      && receivedArray.includes(person.id) == false 
      && requestsArray.includes(person.id) == false) {
    usersArray.push(person)
  }
  else if(friendsArray.includes(person.id) == true){
    friendsPrint.push(person)
  }
  else if(requestsArray.includes(person.id) == true){
    requestPrint.push(person)
  }
})

return (

  <div className="wrapper">

    <div className="wrap bigSize">
    <div className="search">
          <div className="inputSearch">
            <input type="text"
                   placeholder='Type the exact email here'
                   value={searchData} 
                   onChange={(e) => setSearchData(e.target.value)}
                   />
          </div>
        </div>
      {usersArray.map((person) => {
        return <AddFriend key = {person.id}
                          name = {person.Name}
                          email = {person.email}
                          docId = {person.id}
                />          
      } )}

       {friendsPrint.map((person) => {
        return <Friend key = {person.id}
                          name = {person.Name}
                          email = {person.email}
                          docId = {person.id}
                />          
      } )}

      {requestPrint.map((person) => {
              return <SentRequests key = {person.id}
                                name = {person.Name}
                                email = {person.email}
                                docId = {person.id}
                      />          
            } )}
      <button onClick={fetchPrevious} className={`grey requestBtn ` + hide} > Prev</button>
          <button onClick={fetchNext} className={`grey requestBtn ` + hide}> Next</button>
    </div>
  </div>

)
}

export default AddFriendsPage