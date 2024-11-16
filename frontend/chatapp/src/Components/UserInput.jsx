// UserInput.js
import React from "react";
import { IoSend } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";

const UserInput = ({ userInput, handleChange, handleSend, loading }) => (
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
            <IoSend fontSize={40} onClick={handleSend} color={"orangered"} />
          </button>
        )}
      </div>
    </div>
  </div>
);

export default UserInput;
