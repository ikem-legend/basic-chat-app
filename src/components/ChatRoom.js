import React, {useState} from "react"
import {useParams} from "react-router-dom"
import useChat from "../hooks/useChat"

const ChatRoom = ({chats}) => {
  const {roomId} = useParams();
  const messageList = [
    {ownedByCurrentUser: true, body: 'Hi'},
    {ownedByCurrentUser: true, body: 'How far'},
    {ownedByCurrentUser: false, body: 'Heyy'},
    {ownedByCurrentUser: true, body: 'Yo'},
    {ownedByCurrentUser: false, body: 'You good?'},
    {ownedByCurrentUser: true, body: 'What\'s up?'}
  ]
  // const {messages, sendMessage} = useChat(roomId);
  const [messages, sendMessage] = useState(messageList);
  const [newMessage, setNewMessage] = useState('');

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="m-auto w-3/5">
      <h1 className="text-3xl font-bold text-center">Room: {roomId}</h1>
      <div className="messages-container w-full min-h-full p-2 border-2 border-gray-400 rounded">
        <ol className="messages-list">
          {messages.map((message, i) => (
            <li
              key={i}
              className={`message-item ${
                message.ownedByCurrentUser ? "sent-message" : "received-message"
              }`}
            >
              {message.body}
            </li>
          ))}
          {chats.map((chatDetail, i) => (
            <p key={chatDetail.timestamp}>{chatDetail.content}</p>
          ))}
        </ol>
        <textarea
          value={newMessage}
          onChange={handleNewMessageChange}
          placeholder="Write message..."
          className="new-message-input-field"
        />
        <button onClick={handleSendMessage} className="send-message-button block w-full bg-green-500 p-2">
          Send
        </button>
    </div>
    </div>
  );
};

export default ChatRoom