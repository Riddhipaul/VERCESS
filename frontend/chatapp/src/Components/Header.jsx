import React from "react";
import { MdAddBox } from "react-icons/md";

const Header = ({ handleAddNewChat }) => (
  <div className="header" style={{ padding: "0.8rem" }}>
    <MdAddBox
      fontSize={"40"}
      onClick={handleAddNewChat}
      color={"black"}
      style={{ float: "right", color: "#cbc8c8" }}
    />
  </div>
);

export default Header;