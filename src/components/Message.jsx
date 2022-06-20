import React from 'react'

function Message(props) {
  var nameClass = "";
  if (props.sender != props.currUser) {
    nameClass = "message"
  }
  else{
    nameClass = "receivedMess"
  }
  return (
    <div >
      
      <div className={nameClass + ` larger`}>
        {props.content}
        
      </div>
      <div className="date">

          {new Date(props.date.seconds * 1000).toLocaleDateString("en-US")}
      </div>
  
  </div>
    
  )
}

export default Message