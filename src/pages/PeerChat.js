import React, {useEffect, useState} from "react"
import ChatRoom from "../components/ChatRoom"
import Navbar from "../components/Navbar"
import {auth, db} from "../services/firebase"

const PeerChat = ({authenticated, history}) => {
  const chatData = {
    user: auth().currentUser,
    chats: [],
    content: '',
    readError: null,
    writeError: null
  }
  const [chatState, setChatState] = useState({...chatData})
  useEffect(() => {
    try {
      db.ref("messages").on("value", snapshot => {
        let chats = [];
        snapshot.forEach((snap) => {
          chats.push(snap.val());
        });
        setChatState({...chatState, chats});
      });
    } catch (error) {
      setChatState({...chatState, readError: error.message});
    }
  })
  return (
    <div className="wrapper">
      <Navbar authenticated={authenticated} history={history} />
      <div className="container mx-auto">
        <div className="grid-rows-1">
          <div className="grid-cols-1 flex h-screen">
            <ChatRoom chats={chatState.chats} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PeerChat