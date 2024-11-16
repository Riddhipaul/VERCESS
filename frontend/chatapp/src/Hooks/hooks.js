// hooks.js
import { useState, useEffect } from "react";
import { parseResponse, convertEmailToReadableText } from "../Utils/utils";

// Custom hook to handle email toggle and fetch email data
export const useEmailToggle = (url, Emails, setEmails, setActionItems, setConversationList) => {
  const [isToggled, setIsToggled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const emailList = Emails.map(convertEmailToReadableText);
    setIsToggled(!isToggled);
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
    const { emailList: parsedEmailList, actionItems } = parseResponse(data.response);
    setEmails(parsedEmailList);
    setActionItems(actionItems);
    setConversationList((item) => [
      ...item,
      {
        Human: "List down the immediate action items",
        AI: `The actions items are ${actionItems}`,
      },
    ]);
  };

  return { isToggled, loading, setLoading, handleToggle };
};

// Custom hook to fetch chat history
export const useFetchHistory = (url, newChat, setdataHistory) => {
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
        setdataHistory(data.historyList);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchHistory();
  }, [newChat, url, setdataHistory]);
};