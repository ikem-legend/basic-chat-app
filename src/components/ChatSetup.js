import React, {useState} from "react";
import {Link} from "react-router-dom";

const ChatSetup = () => {
  const [userName, setUserName] = useState("");

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  return (
    <div className="m-auto w-3/5">
      <div className="border-2 border-gray-400 rounded mb-4">
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={handleUserNameChange}
          className="p-2"
        />
      </div>
      <div className="bg-green-500 text-white border-2 border-gray-400 rounded text-center p-2">
        <Link to={`/${userName}`}>
          Register
        </Link>
      </div>
    </div>
  );
};

export default ChatSetup;