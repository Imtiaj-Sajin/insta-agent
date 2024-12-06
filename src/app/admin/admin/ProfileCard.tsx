import React, { FC } from "react";
import "./ProfileCard.css";

interface ProfileCardProps {
  name: string;
  username: string;
  email: string;
  phone: string;
  title: string;
  image: string;
}

const ProfileCard: FC<ProfileCardProps> = ({ name, username, email, phone, title, image }) => {
  return (
    <div className="profile-card-outer">
      <div className="profile-card">
        {/* Profile Picture */}
        <div className="profile-image">
          <img src={image} alt={`${name}'s profile`} />
        </div>

        {/* Name */}
        <h2 className="profile-name">{name}</h2>

        {/* User Details */}
        <p className="profile-detail"><strong>Username:</strong> {username}</p>
        <p className="profile-detail"><strong>Email:</strong> {email}</p>
        <p className="profile-detail"><strong>Phone:</strong> {phone || "N/A"}</p>
        <p className="profile-detail"><strong>Title:</strong> {title || "N/A"}</p>

        {/* Edit Button */}
        <button className="profile-edit-btn">Edit Profile</button>
      </div>
    </div>
  );
};

export default ProfileCard;
