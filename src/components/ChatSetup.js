import React, {useState} from "react"
import {useForm} from "react-hook-form"
import log from "loglevel"
import {login, signup} from "../helpers/auth"

const ChatSetup = () => {
  // const [userName, setUserName] = useState("")
  const [auth, setAuth] = useState(false)
  const {register, handleSubmit, getValues, reset, errors} = useForm()
  const [error, setError] = useState(null)
  const userAuthStatus = auth ? "Register" : "Login"

  const authorizeUser = async() => {
    // try {
      const {username} = getValues()
      if (auth) {
        await signup(username, setError)
      } else {
        await login(username, setError)
      }
      // setUserName(username)
      reset()
    // } catch(error) {
    //   setError(error.message)
    //   log.warn(error)
    // }
  };

  return (
    <div className="m-auto w-3/5">
      <form onSubmit={handleSubmit(authorizeUser)}>
        <div className="border-2 border-gray-400 rounded mb-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            ref={register({required: true, pattern: /[A-Za-z]{3,}/, minLength: 3, maxLength: 20})}
            className="p-2 w-full"
          />
          <div className="text-red-300">{errors.userName?.type === "required" && "Your username is required"}</div>
          <div className="text-red-300">{errors.userName?.type === "pattern" && "Please enter valid username"}</div>
          <div className="text-red-300">{errors.userName?.type === "minLength" && "Username must be a minimum of 3 letters"}</div>
          <div className="text-red-300">{errors.userName?.type === "maxLength" && "Username must be a maximum of 20 letters"}</div>
        </div>
        {error ? (
          <div className="text-red-300"><p className="text-center">{error}</p></div>
        ): null}
        <div className="bg-green-500 text-white border-2 border-gray-400 rounded text-center p-2">
          <button type="submit" className="w-full">
            {userAuthStatus}
          </button>
        </div>
        <span className="mt-2 float-right text-center" onClick={() => setAuth(!auth)}>{auth ? "Got an account? Log in" : "Don't have an account? Sign up"}</span>
      </form>
    </div>
  );
};

export default ChatSetup;