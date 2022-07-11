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
  let snap1, snap2, snap3, snap4, snap5, snap6;
  // Get all the users
  const [users, setUsers] = useState([{
    email: currentUser.email,
    id: currentUser.uid
  }]);

  const getUsers =  () => {
    snap1 = db.collection('users').onSnapshot(snapshot => {
    setUsers(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
    });  
  }
  const getPaginationFriends =  () => {
    snap2 = db.collection('users').doc(`${currentUser.uid}`).collection("friends").where("email", "==",searchData ).onSnapshot(snapshot => {
    setFriends(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
    });  
  }
  const getPaginationAll = () => {
        snap3 = db.collection('users').doc(`${currentUser.uid}`).collection("friends").orderBy('interactedAt',"desc").limit(limit).onSnapshot(snapshot => {
          setFriends(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
          setLastData(snapshot.docs[snapshot.size - 1]);
        },
        error => {
          console.log(error);
        });    
  }

  useEffect(() => {
    if(currentUser.uid == 0){

    }
    else{
      getUsers();
      getPaginationAll();
      return () => {
        snap3();
      };
    }
   
    
   }, [currentUser ]);

  useEffect(() => {
    if (searchData == "") {
      if(currentUser.uid != 0){
        getPaginationAll();
        setHide("");
      }
      
    } else {
      getPaginationFriends();
      setHide("hide");
    }
   
  }, [searchData]);
  //  Check if user Exist: if Not, create a new user

  var existance =[];

  const createUser =async  () =>{
    if (currentUser.displayName == null) {
      await db.collection('users').doc(currentUser.uid).set({
        Name: currentUser.email,
        email: currentUser.email,
      })
    } else {
      await db.collection('users').doc(currentUser.uid).set({
        Name: currentUser.displayName,
        email: currentUser.email,
      })
    }
    
 
  } 


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
      snap5 = db.collection('users').doc(`${currentUser.uid}`).collection("friends").orderBy('interactedAt',"desc").startAfter(lastData).limit(limit).onSnapshot(snapshot => {
        if(snapshot.size > 0){
            setFriends(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
            setFirstData(snapshot.docs[0])
            setLastData(snapshot.docs[snapshot.size - 1]);
        }

      });
}

const fetchPrevious = () => {
  snap6 = db.collection('users').doc(`${currentUser.uid}`).collection("friends").orderBy('interactedAt',"desc").endBefore(firstData).limitToLast(limit).onSnapshot(snapshot => {
    if(snapshot.size > 0){
        setFriends(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        setFirstData(snapshot.docs[0])
        setLastData(snapshot.docs[snapshot.size - 1])
    }
    
  });
}


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
  


export default MainMenu
