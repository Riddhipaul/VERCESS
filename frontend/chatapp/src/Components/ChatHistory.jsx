// ChatHistory.js
import React from "react";
import { LuFlower } from "react-icons/lu";
import { CiChat1 } from "react-icons/ci";
import ReactMarkdown from "react-markdown";

const ChatHistory = ({ dataHistory, markdownContent }) => (
  <div className="left-container">
    <div className="left-contaier-heading">
      <LuFlower className="icon" />
      <p>VERCESS</p>
    </div>
    <div className="left-container-content" style={{ padding: "1.2rem" }}>
      {dataHistory.map((eachitem, index) => (
        <div key={index} className="chat-item">
          <CiChat1
            fontSize={"20"}
            color={"white"}
            style={{ marginTop: "0.5rem" }}
          />
          <p className="chat-items">{eachitem}</p>
        </div>
      ))}
      <div style={{ color: "white" }}>
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </div>
    </div>
  </div>
);

export default ChatHistory;