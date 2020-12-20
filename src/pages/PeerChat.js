import React from 'react'
import ChatRoom from '../components/ChatRoom'
import Navbar from '../components/Navbar'

const PeerChat = ({authenticated, history}) => {
  return (
    <div className="wrapper">
      <Navbar authenticated={authenticated} history={history} />
      <div className="container mx-auto">
        <div className="grid-rows-1">
          <div className="grid-cols-1 flex h-screen">
            <ChatRoom />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PeerChat
