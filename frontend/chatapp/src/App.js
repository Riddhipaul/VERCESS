// App.js
import React, { useState } from "react";
import "./App.css";
import Header from "./Components/Header";
import ChatHistory from "./Components/ChatHistory";
import ChatArea from "./Components/ChatArea";
import UserInput from "./Components/UserInput";
import EmailList from "./Components/EmailList";
import ToggleSwitch from "./Components/ToggleSwitch";
import Emails from "./Components/EmailList";
import { useEmailToggle, useFetchHistory } from "./Hooks/hooks";

function App() {
  const date = new Date();
  const [userInput, setUserInput] = useState("");
  const url = "http://127.0.0.1:5000";
  const [markdownContent, setMarkdownContent] = useState("");
  const [dataHistory, setdataHistory] = useState([]);
  const [conversationList, setConversationList] = useState([
    {
      Human: "Tell me a joke with AI",
      AI: "Why did AI go to therapy? Because it was struggling with emotions",
    },
  ]);
  const [emails, setEmails] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [newChat, setNewChat] = useState("");

  const { isToggled, loading, setLoading, handleToggle } = useEmailToggle(
    url,
    Emails,
    setEmails,
    setActionItems,
    setConversationList
  );

  useFetchHistory(url, newChat, setdataHistory);

  const handleSend = async () => {
    setLoading(true);
    const response = await fetch(`${url}/hello`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: `${userInput}` }),
    });
    const data = await response.json();
    setLoading(false);
    setConversationList((item) => [
      ...item,
      { Human: userInput, AI: data.response },
    ]);
    setUserInput("");
  };

  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleAddNewChat = async () => {
    const response = await fetch(`${url}/newchat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat: conversationList }),
    });
    const data = await response.json();
    setNewChat(data.message);
  };

  return (
    <div className="App">
      <div className="chat-history">
        <ChatHistory dataHistory={dataHistory} markdownContent={markdownContent} />
      </div>
      <div className="chat-area">
        <Header handleAddNewChat={handleAddNewChat} />
        <ChatArea conversationList={conversationList} />
        <UserInput
          userInput={userInput}
          handleChange={handleChange}
          handleSend={handleSend}
          loading={loading}
        />
      </div>
      <div className="right-container">
        <div className="header" style={{ padding: "0.8rem" }}>
          <h3>Emails</h3>
          <ToggleSwitch isToggled={isToggled} handleToggle={handleToggle} />
        </div>
        <EmailList emails={emails} />
      </div>
    </div>
  );
}

export default App;