import React, {useEffect, useState, useReducer} from 'react'
import {useForm} from 'react-hook-form'
import {toast} from 'react-toastify'
import {auth, db} from '../services/firebase'

const ChatRoom = () => {
  const [chatState, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'UPDATE_CHAT_LIST':
          return {...state, chats: action.payload}

        case 'UPDATE_USER_LIST':
          return {...state, users: action.payload}

        case 'UPDATE_CONTENT':
          return {...state, content: action.payload}

        case 'SET_READ_ERROR':
          return {...state, readError: action.payload}

        case 'SET_WRITE_ERROR':
          return {...state, writeError: action.payload}

        case 'CLEAR_READ_ERROR':
          return {...state, readError: null}

        case 'CLEAR_WRITE_ERROR':
          return {...state, writeError: null}

        default:
          return state
      }
    },
    {
      currentUser: auth().currentUser,
      users: [],
      chats: [],
      content: '',
      readError: null,
      writeError: null,
    },
  )
  const [recipient, setRecipient] = useState('')
  useEffect(() => {
    dispatch({type: 'CLEAR_READ_ERROR'})
    try {
      db.ref('messages').on('value', (snapshot) => {
        let chats = []
        snapshot.forEach((snap) => {
          chats.push(snap.val())
        })
        dispatch({type: 'UPDATE_CHAT_LIST', payload: chats})
      })
    } catch (error) {
      dispatch({type: 'SET_READ_ERROR', payload: error.message})
    }
  }, [])
  useEffect(() => {
    try {
      db.ref('users').on('value', (snapshot) => {
        let users = []
        snapshot.forEach((snap) => {
          users.push(snap.val())
        })
        dispatch({type: 'UPDATE_USER_LIST', payload: users})
      })
    } catch (error) {
      dispatch({type: 'SET_READ_ERROR', payload: error.message})
    }
  }, [])
  const {register, reset, errors, getValues, handleSubmit} = useForm()
  const updateContent = () => {
    const newChatMessage = getValues('newMessage')
    dispatch({type: 'UPDATE_CONTENT', payload: newChatMessage})
  }

  const selectUser = (selectedUserName) => {
    setRecipient(selectedUserName)
  }

  const handleSendMessage = async () => {
    dispatch({type: 'CLEAR_WRITE_ERROR'})
    if (recipient) {
      try {
        await db.ref('messages').push({
          content: chatState.content,
          timestamp: Date.now(),
          senderUid: chatState.currentUser.uid,
          receiverUid: recipient,
        })
        reset()
        dispatch({type: 'UPDATE_CONTENT', payload: ''})
      } catch (err) {
        dispatch({type: 'SET_WRITE_ERROR', payload: err.message})
      }
    } else {
      toast.error('Please select a user to chat with')
    }
  }

  return (
    <div className="m-auto w-3/5">
      <h1 className="text-3xl font-bold text-center">User List</h1>
      <div className="users-container w-full min-h-full p-2 border-2 border-gray-400 rounded">
        <ol className="users-list">
          {chatState.users.map((user, idx) => (
            <li key={idx} onClick={() => selectUser(user.displayName)}>
              {user.displayName}
            </li>
          ))}
        </ol>
      </div>
      <h1 className="text-3xl font-bold text-center">User: {recipient}</h1>
      <div className="messages-container w-full min-h-full p-2 border-2 border-gray-400 rounded">
        <ol className="messages-list">
          {chatState.chats.map((chatDetail) => (
            <li
              key={chatDetail.timestamp}
              className={`${
                chatDetail.senderUid === chatState.currentUser.uid
                  ? 'sent-message'
                  : 'received-message'
              }`}
            >
              {chatDetail.content}
            </li>
          ))}
        </ol>
        <form onSubmit={handleSubmit(handleSendMessage)}>
          <textarea
            name="newMessage"
            placeholder="Write message..."
            ref={register({required: true, minLength: 2, maxLength: 200})}
            onChange={updateContent}
            className="new-message-input-field"
          />
          <div className="text-red-300">
            {errors.newMessage?.type === 'required' &&
              'Your message is required'}
          </div>
          <div className="text-red-300">
            {errors.newMessage?.type === 'minLength' &&
              'Message must be a minimum of 2 characters'}
          </div>
          <div className="text-red-300">
            {errors.newMessage?.type === 'maxLength' &&
              'Message must be a maximum of 200 characters'}
          </div>
          <div className="text-red-300">
            {chatState.error ? `${chatState.writeError}` : null}
          </div>
          <button
            type="submit"
            className="send-message-button block w-full bg-green-500 p-2"
            disabled={!chatState.content?.length}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatRoom
