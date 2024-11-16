// ToggleSwitch.js
import React from "react";

const ToggleSwitch = ({ isToggled, handleToggle }) => (
  <div className="toggle-container">
    <div
      className={`toggle-slider ${isToggled ? "on" : "off"}`}
      onClick={handleToggle}
    >
      <div className="toggle-thumb"></div>
    </div>
  </div>
);

export default ToggleSwitch;