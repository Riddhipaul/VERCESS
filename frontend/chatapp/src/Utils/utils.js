// utils.js

// Utility function to parse the response
export const parseResponse = (response) => {
    const cleanedResponse = response.replace(/'/g, "");
    const parsedResponse = JSON.parse(cleanedResponse);
    const emailList = parsedResponse.EmailsList;
    const actionItems = parsedResponse.actionItems;
    return { emailList, actionItems };
  };
  
  // Utility function to convert email data to readable text
  export const convertEmailToReadableText = (email) => {
    const headers = email.payload.headers.reduce((acc, header) => {
      acc[header.name] = header.value;
      return acc;
    }, {});
    const bodyData = email.payload.body.data;
    const bodyText = atob(bodyData);
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
  };