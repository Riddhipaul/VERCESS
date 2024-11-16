// EmailList.js
import React from "react";

const EmailList = ({ emails }) => (
  <div className="email-row">
    {emails.map((email, index) => (
      <div className="card" key={index}>
        <div className="card-body">
          <input
            type="checkbox"
            className="form-check-input"
            id={`email-checkbox-${index}`}
          />
          <label className="form-check-label" htmlFor={`email-checkbox-${index}`}>
            <h5 className="card-title">{email.Subject}</h5>
            <p className="card-text">{email.Body}</p>
          </label>
        </div>
      </div>
    ))}
  </div>
);

export default EmailList;