import './App.css';
import "./styles/styles.css"
import Mainmenu from './components/MainMenu';
import SignIn from "./components/signIn"
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./firebase.js";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Messages from './components/Messages';
import { UserContext } from './contexts/UserContext';
import {useState, useEffect} from 'react';
import FriendRequests from './components/FriendRequests/FriendRequests';
import SideBar from './components/NavBar/SideBar';
import AddFriendsPage from './components/AddFriends/AddFriendsPage';
import MessagePlaceHolder from './components/AddFriends/MessagePlaceHolder';


function App() {
  // Authentified user
  const [user] = useAuthState(auth);

  // Send the Auth user via context
  const [currentUser, setCurrentUser] = useState({
    uid:0,
    email:"",
    name:""
  });
  useEffect(() => {
    if(user != null){
      setCurrentUser(user);
    }
    
  }, [user]);


  if (user) {
    return (
      <Router>
      <UserContext.Provider value={{currentUser, setCurrentUser}}>
      <div className='mainFrame'>
      <SideBar/>
      
     <Routes>
          <Route path="/" element={<Mainmenu/>}>
            <Route path='messages/:userId' element={<Messages/>}/>
            <Route path='' element={<MessagePlaceHolder/>}/>
          </Route>
          <Route path='*' element={<Mainmenu/>}/>
          <Route path='/friendrequests' element={<FriendRequests/>}/>
          <Route path="/signin" element={<SignIn/>}/>
          <Route path='/addfriends' element={<AddFriendsPage/>}/>
    </Routes>
    </div>
    </UserContext.Provider>
  </Router>
    );
    
  } else {
    return (
    <Router>
      <UserContext.Provider value={{currentUser, setCurrentUser}}>
     <Routes>
          <Route path="/" element={<SignIn/>}/>
    </Routes>
    </UserContext.Provider>
  </Router>)
  }

}

export default App;
