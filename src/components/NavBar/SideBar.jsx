import React, { useState, useEffect, useContext} from 'react';
import {Link} from "react-router-dom"
import { UserContext } from '../../contexts/UserContext.jsx';
import image from "../../styles/1.png"
import Logout from '../Logout.jsx';
function SideBar() {
  const {currentUser} = useContext(UserContext);

  return (
    <div className='sideBar'>
    <div className="align image">
        <div className="img">
            <img src={image} height="50" width="50" />
        </div>
        <div className="profileName">
            {currentUser.displayName}
        </div>
    </div>
    <div className="navs">
        <ul>
            <hr className='hrNavs'/>
            <Link className='links' to={`/` }>  
                <li>Friends</li>
            </Link>
            <hr className='hrNavs'/>
            <Link className='links' to={`/friendrequests` }>  
                 <li>Friend requests</li>
            </Link>
            <hr className='hrNavs'/>
            <Link className='links' to={`/addfriends` }>  
                <li>Add Friend</li>
            </Link>
            <hr className='hrNavs'/>
        </ul>
    </div>
    
    <div className="align navFooter">
        <div className="logout">
            <Logout/>
        </div>
        <div className="about">
            About
        </div>
    </div>
    
    </div>
  )
}

export default SideBar