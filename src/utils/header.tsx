import React from "react";
import { FaBell } from "react-icons/fa";

const HeaderUI: React.FC = () => {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "10px",
        backgroundColor: "white",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* Language Selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: "20px",
          padding:"0px 8px",
          borderRadius: "20px",
          height:"30px",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            backgroundColor: "rgba(250, 250, 250, 0.05)",
            justifyContent: "center",
            cursor: "pointer",
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg"
          alt="USA Flag"
          style={{
            width: "20px",
            height: "12px",
            marginRight: "5px",

          }}
        />
        <span style={{ fontSize: "14px", color: "#555" }}>English</span>
      </div>

        {/* Notifications Icon */}
        <div
        style={{
            position: "relative",
            marginRight: "20px",
            borderRadius: "50%",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            backgroundColor: "rgba(250, 250, 250, 0.05)",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
        }}
        >
        <span
            style={{
            fontSize: "20px",
            color: "rgba(0,0,0,1)",
            }}
        >
            <FaBell />
        </span>
        {/* Notification Badge */}
        <span
            style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            backgroundColor: "red",
            color: "white",
            borderRadius: "50%",
            width: "10px",
            height: "10px",
            fontSize: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            }}
        ></span>
        </div>


      {/* Profile Icon */}
      <div>
        <img
          src="https://imtiaj-sajin.github.io/images/image1.JPG"
          alt="Profile"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        />
      </div>
    </span>
  );
};

export default HeaderUI;

