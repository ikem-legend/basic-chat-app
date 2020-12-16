import React, {useEffect, useState} from "react"
import {useForm} from "react-hook-form";
import {auth, db} from "../services/firebase";

const ChatRoom = () => {
  const chatData = {
    currentUser: auth().currentUser,
    users: [],
    chats: [],
    content: '',
    readError: null,
    writeError: null
  }
  const [chatState, setChatState] = useState({...chatData})
  const [recipient, setRecipient] = useState('')
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
  }, [chatState])
  useEffect(() => {
    try {
      db.ref("users").on("value", snapshot => {
        let users = [];
        snapshot.forEach((snap) => {
          users.push(snap.val());
        });
        setChatState({...chatState, users});
      });
    } catch (error) {
      setChatState({...chatState, readError: error.message});
    }
  }, [chatState])
  const {register, reset, errors, handleSubmit} = useForm()

  const selectUser = (selectedUserName) => {
    setRecipient(selectedUserName)
  }

  const handleSendMessage = async () => {
    setChatState({...chatState, writeError: null});
    try {
      await db.ref("messages").push({
        content: chatState.content,
        timestamp: Date.now(),
        senderUid: chatState.user.uid,
        receiverUid: recipient
      })
      reset()
    } catch(err) {
      setChatState({...chatState, writeError: err.message})
    }
  };

  return (
    <div className="m-auto w-3/5">
      <h1 className="text-3xl font-bold text-center">User List</h1>
      <div className="users-container w-full min-h-full p-2 border-2 border-gray-400 rounded">
        <ol className="users-list">
          {chatState.users.map((user, idx) => (
            <li key={idx} onClick={() => selectUser(user.displayName)}>{user.displayName}</li>
          ))}
        </ol>
      </div>
      <h1 className="text-3xl font-bold text-center">User: {recipient}</h1>
      <div className="messages-container w-full min-h-full p-2 border-2 border-gray-400 rounded">
        <ol className="messages-list">
          {chatState.chats.map((chatDetail) => (
            <li key={chatDetail.timestamp} className={`${chatDetail.senderUid === chatState.currentUser.uid ? "sent-message" : "received-message"}`}>{chatDetail.content}</li>
          ))}
        </ol>
        <form onSubmit={handleSubmit(handleSendMessage)}>
          <textarea
            name="newMessage"
            placeholder="Write message..."
            ref={register({required: true, minLength: 2, maxLength: 200})}
            className="new-message-input-field"
          />
          <div className="text-red-300">{errors.newMessage?.type === "required" && "Your username is required"}</div>
          <div className="text-red-300">{errors.newMessage?.type === "minLength" && "Username must be a minimum of 3 letters"}</div>
          <div className="text-red-300">{errors.newMessage?.type === "maxLength" && "Username must be a maximum of 20 letters"}</div>
          <div className="text-red-300">{chatState.error ? `${chatState.writeError}` : null}</div>
          <button type="submit" className="send-message-button block w-full bg-green-500 p-2">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom