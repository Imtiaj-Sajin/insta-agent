import { signOut } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const ProfileHoverCard = ({ token }: { token: any }) => {
  const [isCardVisible, setIsCardVisible] = useState(false); // State to toggle card visibility
  const [cardPosition, setCardPosition] = useState<"top" | "bottom">("bottom"); // State to control card's position
  const [cardAlignment, setCardAlignment] = useState<"left" | "right">("left"); // State to control card alignment

  const toggleCardVisibility = () => {
    setIsCardVisible((prev) => !prev); // Toggle visibility on click
    setCardPosition("bottom"); // Set default position (you can add logic to alternate)
  };


  useEffect(() => {
    if (isCardVisible) {
      // Get window width to determine if card is too wide to the right
      const windowWidth = window.innerWidth;
      const cardWidth = 200; // The width of the profile card
      const cardLeftPosition = 0; // Left of the profile image (0px in this case)

      // If the card is too far right, align it to the left
      if (cardLeftPosition + cardWidth > windowWidth) {
        setCardAlignment("right");
      } else {
        setCardAlignment("left");
      }
    }
  }, [isCardVisible, token]);
  if (!token) return null;
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Profile Pic with onClick to toggle the hover card */}
      <div onClick={toggleCardVisibility}>
        {/* <img
          src={token.picture?token.picture:"https://fakeimg.pl/300/"}
          alt="Profile"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            cursor: "pointer",
          }} 
        />*/}
          <Image
          src={token.picture?token.picture:"https://fakeimg.pl/300/"}
          alt="Profile"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          />
      </div>

      {/* Profile Hover Card (Only shown when clicked) */}
      {isCardVisible && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "white",
            padding: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            width: "200px",
            zIndex: 10,
            opacity: 1,
            visibility: "visible",
            transition: "visibility 0s, opacity 0.3s ease",
            ...(cardPosition === "top"
              ? { bottom: "100%", marginBottom: "10px" }
              : { top: "100%", marginTop: "23px" }), // marginTop set to 20px
            left: cardAlignment === "left" ? "-11rem" : "auto", // left margin set to -11rem
            right: cardAlignment === "right" ? "0" : "auto", // Align to left or right
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* <img
              src={token.picture?token.picture:"https://fakeimg.pl/300/"}
              alt="Profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
              }}
            /> */}
            <Image
              src={token.picture?token.picture:"https://fakeimg.pl/300/"}
              alt="Profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
              }}
            />
            <div>
              <p style={{ fontWeight: "bold" }}>{token.name}</p>
              <p style={{ fontSize: "12px", color: "#777" }}>{token.type}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            style={{
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "5px",
              width: "100%",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileHoverCard;
