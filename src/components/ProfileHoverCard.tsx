import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { logout } from "../app/login/actions";

import React, { useState, useEffect } from "react";

const ProfileHoverCard = () => {
  const [isCardVisible, setIsCardVisible] = useState(false); // State to toggle card visibility
  const [cardPosition, setCardPosition] = useState<"top" | "bottom">("bottom"); // State to control card's position
  const [cardAlignment, setCardAlignment] = useState<"left" | "right">("left"); // State to control card alignment
  const [token, setToken] = useState<any>(null);
  const toggleCardVisibility = () => {
    setIsCardVisible((prev) => !prev); // Toggle visibility on click
    setCardPosition("bottom"); // Set default position (you can add logic to alternate)
  };
  useEffect(() => {
  const fetchToken = async () => {
    try {
      const response = await fetch("/api/header", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Token Data:", data);
        setToken(data.token);
      } else {
        console.error("Failed to fetch token, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  fetchToken();
}, []);

const user = {
  name: token?.name || "John Doe",
  role: token?.type || "User",
  profilePicUrl: token?.picture || "https://fakeimg.pl/300/",
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
  }, [isCardVisible]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Profile Pic with onClick to toggle the hover card */}
      <div onClick={toggleCardVisibility}>
        <img
          src={user.profilePicUrl?user.profilePicUrl:"https://fakeimg.pl/300/"}
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
            <img
              src={user.profilePicUrl?user.profilePicUrl:"https://fakeimg.pl/300/"}
              alt="Profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
              }}
            />
            <div>
              <p style={{ fontWeight: "bold" }}>{user.name}</p>
              <p style={{ fontSize: "12px", color: "#777" }}>{user.role}</p>
            </div>
          </div>
          <button
                // <button className="bg-white rounded-full border border-gray-200 text-gray-800 px-4 py-2 flex items-center space-x-2 hover:bg-gray-200">
                //   <img
                //     className="h-8 w-8 rounded-full"
                //     src="https://xsgames.co/randomusers/avatar.php?g=male"
                //     alt="User profile"
                //   />{/* </button> */}
                 onClick={() => signOut()}
                
            // onClick={logout} // Call logout function when clicking the button
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
