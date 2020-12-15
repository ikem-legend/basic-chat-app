import React from "react"
import ChatRoom from "../components/ChatRoom"

const Chat = () => {
  return (
    <div className="container mx-auto">
      <div className="grid-rows-1">
        <div className="grid-cols-1 flex h-screen">
          <ChatRoom />
        </div>
      </div>
    </div>
  )
}

export default Chat