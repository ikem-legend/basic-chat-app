import React, {useEffect, useState} from "react"
import {useForm} from "react-hook-form";
import {auth, db} from "../services/firebase";

const ChatRoom = ({chats, user, error, writeError}) => {
  const chatData = {
    currentUser: auth().currentUser,
    users: [],
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
  const {getValues, register, reset, errors, handleSubmit} = useForm()
  const messageList = [
    {ownedByCurrentUser: true, body: 'Hi'},
    {ownedByCurrentUser: true, body: 'How far'},
    {ownedByCurrentUser: false, body: 'Heyy'},
    {ownedByCurrentUser: true, body: 'Yo'},
    {ownedByCurrentUser: false, body: 'You good?'},
    {ownedByCurrentUser: true, body: 'What\'s up?'}
  ]
  // const {messages, sendMessage} = useChat(roomId);
  // const [messages, sendMessage] = useState(messageList);
  // const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async () => {
    setChatState({...chatState, writeError: null});
    try {
      await db.ref("messages").push({
        content: chatState.content,
        timestamp: Date.now(),
        senderUid: chatState.user.uid,
        receiverUid: ''
      })
      reset()
    } catch(err) {
      setChatState({...chatState, writeError: err.message})
    }
  };

  return (
    <div className="m-auto w-3/5">
      <h1 className="text-3xl font-bold text-center">User: </h1>
      <div className="messages-container w-full min-h-full p-2 border-2 border-gray-400 rounded">
        <ol className="messages-list">
          {/*messages.map((message, i) => (
            <li
              key={i}
              className={`message-item ${
                message.ownedByCurrentUser ? "sent-message" : "received-message"
              }`}
            >
              {message.body}
            </li>
          ))*/}
          {chatState.chats.map((chatDetail, i) => (
            <p key={chatDetail.timestamp} className={`${chatDetail.senderUid === chatState.currentUser.uid ? "sent-message" : "received-message"}`}>{chatDetail.content}</p>
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