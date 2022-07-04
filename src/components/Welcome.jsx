import React from 'react'
import SignIn from './signIn'
import Bond from "../styles/bond.png"
import Add from "../styles/add.png"
import Message from "../styles/message.png"


function Welcome() {
  return (
    <div className="Welcome">
        <div className="tagline">
            <h1>
                Talkative
            </h1>
            <h2>
                Connect, bond and reach your loved ones
            </h2>
        </div>
        <div className="description">
             <div className="logos">
                <img src={Bond} alt="" />
                <img src={Message} alt="" />
                <img src={Add} alt="" />
            </div>
            <p>
                A social app where you can talk to anyone anywhere in the world
            </p>
            
        </div>

    </div>
  )
}

export default Welcome