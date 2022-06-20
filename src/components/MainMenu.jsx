import React, { useState, useEffect, useContext} from 'react';
import Users from './Users';
import { db} from '../firebase';
import { UserContext } from '../contexts/UserContext.jsx';
import { Outlet } from "react-router-dom";



function MainMenu() {
  const [hide, setHide] = useState("");
  const [searchData, setSearchData] = useState('');
  const [lastData, setLastData] = useState(0);
  const [firstData, setFirstData] = useState(0);
  const limit = 5;
  // User Auth
  const {currentUser} = useContext(UserContext);
  const [friends, setFriends] = useState([{
    email: "",
    id: ""
  }]);
  // Loading of the users
  const [loading, setLoading] = useState(true);

  // Get all the users
  const [users, setUsers] = useState([{
    email: currentUser.email,
    id: currentUser.uid
  }]);

  const getUsers =  () => {
    db.collection('users').onSnapshot(snapshot => {
    setUsers(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
    });  
  }
  const getPaginationFriends =  () => {
    db.collection('users').doc(`${currentUser.uid}`).collection("friends").where("email", "==",searchData ).onSnapshot(snapshot => {
    setFriends(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
    });  
  }
  const getPaginationAll = () => {
    db.collection('users').doc(`${currentUser.uid}`).collection("friends").orderBy('interactedAt',"desc").limit(limit).onSnapshot(snapshot => {
      setFriends(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
      setLastData(snapshot.docs[snapshot.size - 1]);
      }); 
  }

  useEffect(() => {
    getUsers();
    getPaginationAll();
   }, [currentUser ]);

  useEffect(() => {
    if (searchData == "") {
      getPaginationAll();
      setHide("");
    } else {
      getPaginationFriends();
      setHide("hide");
    }
   
  }, [searchData]);
  //  Check if user Exist: if Not, create a new user

  var existance =[];

  const createUser =async  () =>{
    await db.collection('users').doc(currentUser.uid).set({
      Name: currentUser.displayName,
      email: currentUser.email,
  })
  } 

  useEffect(() => {
    if(users.length != 0){
      setLoading(false) 
    }

  }, [users]);

  
  useEffect(()=>{
    for (let index = 0; index < users.length; index++) {
      if(users[index].email == currentUser.email){
        existance.push("exist");
      }
      else if (users[index].email != currentUser.email){
        existance.push('No');
      }
   }
   if(!existance.includes("exist")){
    createUser();
   }
   
  },[users])




  // Pagination
   
    
  

const fetchNext = () => {
      db.collection('users').doc(`${currentUser.uid}`).collection("friends").orderBy('interactedAt',"desc").startAfter(lastData).limit(limit).onSnapshot(snapshot => {
        if(snapshot.size > 0){
            setFriends(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
            setFirstData(snapshot.docs[0])
            setLastData(snapshot.docs[snapshot.size - 1]);
        }

      });
}

const fetchPrevious = () => {
  db.collection('users').doc(`${currentUser.uid}`).collection("friends").orderBy('interactedAt',"desc").endBefore(firstData).limitToLast(limit).onSnapshot(snapshot => {
    if(snapshot.size > 0){
        setFriends(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        setFirstData(snapshot.docs[0])
        setLastData(snapshot.docs[snapshot.size - 1])
    }
    
  });
}

  // This is the render method based on a condition . IF loading true, render the loading animation, else, render the list of users;

  if(loading == true){
    return (
          
                <div className="lds-facebook">
                  <div></div> 
                  <div></div> 
                  <div></div>
                </div>
    )

    
  }else{
    

    return (
      <div className="wrapper">

      <div className="wrap leftWrap">
        <div className="search">
          <div className="inputSearch">
            <input type="text" 
                   placeholder='Type the exact Email here'
                   value={searchData} 
                   onChange={(e) => setSearchData(e.target.value)}
                   />
          </div>
        </div>

        {friends.map((user) => {
                    return <Users key ={user.id}
                                name = {user.name}
                                email = {user.email}
                                id = {user.id}
                                read = {user.read}
                                />
                            
              })}
           <button onClick={fetchPrevious} className={`grey ` + hide} > Prev</button>
          <button onClick={fetchNext} className={`grey ` + hide}> Next</button>
        
        
      </div>
      <div className="wrap rightWrap"> 
        <Outlet/>
      </div>
      </div>
      
    )
  }
  
}

export default MainMenu
