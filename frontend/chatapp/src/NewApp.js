import logo from "./logo.svg";
import "./App.css";
import { FiAlignJustify } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { useState, useEffect } from "react";
import { MdAddBox } from "react-icons/md";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import Emails from "./EmailData.json";
import ReactMarkdown from "react-markdown";
import { LuFlower } from "react-icons/lu";
import { CiChat1 } from "react-icons/ci";
function App() {
  const date = new Date();
  console.log("Today's date is", date);
  const [userInput, setUserInput] = useState("");
  const url = "http://127.0.0.1:5000";
  const dataList = [{ date: date, chatName: "conversation1", chatHistory: [] }];
  const [markdownContent, setMarkdownContent] = useState("");
  const [dataHistory, setdataHistory] = useState([]);
  const [conversationList, setConversationList] = useState([
    {
      Human: "Tell me a joke with AI",
      AI: "Why did AI go to therapy? Because it was struggling with emotions",
    },
  ]);
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");
  const [isToggled, setIsToggled] = useState(false);
  const [emails, setEmails] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [newChat, setNewChat] = useState("");
  console.log("The email List is", emails);
  console.log("The conversationList", conversationList);
  console.log("The HistoryData", dataHistory);
  const parseResponse = (response) => {
    // Extract email content
    // Remove single quotes from the response string
    console.log("The resposne si", response);
    const cleanedResponse = response.replace(/'/g, "");

    // Parse the cleaned JSON string into a JavaScript object
    const parsedResponse = JSON.parse(cleanedResponse);
    console.log("The parsed Json is", parsedResponse);

    // Extract the emailList and actionItems
    const emailList = parsedResponse.EmailsList;
    const actionItems = parsedResponse.actionItems;

    setEmails(emailList);
    setActionItems(actionItems);
  };

  const handleToggle = async () => {
    const emailList = Emails.map((email) => {
      // Extract headers
      const headers = email.payload.headers.reduce((acc, header) => {
        acc[header.name] = header.value;
        return acc;
      }, {});

      // Extract body
      const bodyData = email.payload.body.data;
      const bodyText = atob(bodyData);

      // Format the email into a readable string
      const readableText = `
        From: ${headers["From"] || "N/A"}
        To: ${headers["To"] || "N/A"}
        Subject: ${headers["Subject"] || "N/A"}
        Date: ${headers["Date"] || "N/A"}
        Snippet: ${email.snippet}
        Body:
        ${bodyText}
        Labels: ${email.labelIds.join(", ")}
        Size Estimate: ${email.sizeEstimate} bytes
        Thread ID: ${email.threadId}
        Internal Date: ${email.internalDate}
        History ID: ${email.historyId}
        ----------------------------------------
        `;
      return readableText;
    });

    setIsToggled(!isToggled);
    console.log("The Readable EmailList is", emailList);
    setLoading(true);
    const response = await fetch(`${url}/getEmailData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `${emailList} This is the emailList. Sort them in priority wise.Please format the response as follows: {EmailsList:[emailList1,...]},actionItems:[item1,item2,...]} 
        Example:
        {
          "EmailsList": [
            {
              "From": "sender2@example.com",
              "To": "recipient2@example.com",
              "Subject": "Meet with the CEO at 6:45",
              "Date": "2023-10-02T12:34:56Z",
              "Snippet": "Meet with the CEO at 6:45.",
              "Body": "Meet with the CAO at 6.45 PM. Receive your feedback.",
              "Labels": "INBOX, IMPORTANT",
              "Size Estimate": "4096 bytes",
              "Thread ID": "fedcba0987654321",
              "Internal Date": "1633158896000",
              "History ID": "0987654321"
            },...]
            "actionItems": [
              "Meet with the CEO at 6:45.",
              "KT to the new team.",
              "Meeting at 8 PM with Marketing Team.",
              "Review the new product.",
              "Handle client calls."
            ]`,
      }),
    });
    const data = await response.json();
    setLoading(false);
    setIsToggled(false);
    console.log("The data is", data.response);
    parseResponse(data.response);
    setConversationList((item) => [
      ...item,
      {
        Human: "List down the immediate action items",
        AI: `The actions items are ${actionItems}`,
      },
    ]);
  };

  const handleSend = async () => {
    setLoading(true);
    console.log("The textarea value is", userInput);
    const response = await fetch(`${url}/hello`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: `${userInput}` }),
    });
    const data = await response.json();
    setLoading(false);
    console.log("The data is", data.response);
    setConversationList((item) => [
      ...item,
      { Human: userInput, AI: data.response },
    ]);
    setUserInput("");
  };

  const handleChange = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  const handleAddNewChat = async () => {
    console.log("The add new chat button is clicked");

    // Convert conversationList to Markdown

    const response = await fetch(`${url}/newchat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat: conversationList }),
    });
    const data = await response.json();
    console.log("The data", data);
    setNewChat(data.message);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${url}/getHistory`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("The data", data);
        setdataHistory(data.historyList);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchHistory();
  }, [newChat]);

  return (
    <div className="App">
      <div className="chat-history">
        <div className="left-container">
          <div className="left-contaier-heading">
            <LuFlower className="icon" />
            <p>VERCESS</p>
          </div>
          <div className="left-container-content" style={{ padding: "1.2rem" }}>
            {dataHistory.map((eachitem, index) => {
              return (
                <div key={index} className="chat-item">
                  <CiChat1
                    fontSize={"20"}
                    color={"white"}
                    style={{ marginTop: "0.5rem" }}
                  />
                  <p className="chat-items">{eachitem}</p>
                </div>
              );
            })}
            <div style={{ color: "white" }}>
              <ReactMarkdown>{markdownContent}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
      <div className="chat-area">
        <div className="header" style={{ padding: "0.8rem" }}>
          <MdAddBox
            fontSize={"40"}
            onClick={handleAddNewChat}
            color={"black"}
            style={{ float: "right", color: "#cbc8c8" }}
          />
        </div>
        <div className="chat-portion">
          {conversationList.map((item, index) => (
            <div key={index}>
              <p className="human-message">{item.Human}</p>
              <p className="ai-message">{item.AI}</p>
            </div>
          ))}
        </div>
        <div className="user-input-area">
          <div style={{ padding: "1rem", display: "flex" }}>
            <textarea
              width="200px"
              id="user-input"
              value={userInput}
              onChange={handleChange}
            ></textarea>
            <div style={{ display: "flex" }}>
              {loading ? (
                <ClipLoader
                  loading={loading}
                  size={50}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                <button type="submit">
                  <IoSend
                    fontSize={40}
                    onClick={handleSend}
                    color={"orangered"}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="right-container">
        <div className="header" style={{ padding: "0.8rem" }}>
          <h3>Emails</h3>
          <div>
            <div className="toggle-container">
              <div
                className={`toggle-slider ${isToggled ? "on" : "off"}`}
                onClick={handleToggle}
              >
                <div className="toggle-thumb"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="email-row">
          {emails.map((email, index) => (
            <div className="card" key={index}>
              <div className="card-body">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`email-checkbox-${index}`}
                />
                <label
                  className="form-check-label"
                  htmlFor={`email-checkbox-${index}`}
                >
                  <h5 className="card-title">{email.Subject}</h5>
                  <p className="card-text">{email.Body}</p>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;


