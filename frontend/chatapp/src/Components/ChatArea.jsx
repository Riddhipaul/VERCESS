// ChatArea.js
import React from "react";

const ChatArea = ({ conversationList }) => (
  <div className="chat-portion">
    {conversationList.map((item, index) => (
      <div key={index}>
        <p className="human-message">{item.Human}</p>
        <p className="ai-message">{item.AI}</p>
      </div>
    ))}
  </div>
);

export default ChatArea;