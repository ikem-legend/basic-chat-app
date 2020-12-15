import React from "react"
import ChatSetup from "../components/ChatSetup";

const Home = () => {
  return (
    <div className="container mx-auto">
      <div className="grid-rows-1">
        <div className="grid-cols-1 flex h-screen">
          <ChatSetup />
        </div>
      </div>
    </div>
  )
}

export default Home