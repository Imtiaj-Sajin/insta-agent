import React from 'react';

const ProfileCard = ({ profileData }: { profileData: string }) => {

  return (
    <div className="profile-card">
      Profile Picture
      <div className="profile-pic">
        <img src={profileData.profile_pic} alt={`${profileData.name}'s Profile`} />
      </div>

      {/* Name and Username */}
      <div className="profile-info">
        <h2>{profileData.name}</h2>
        <p>@{profileData.username}</p>
        {profileData.is_verified_user && <span className="verified">✔ Verified</span>}
      </div>

      {/* Other Information */}
      <div className="profile-stats">
        <p>Followers: {profileData.follower_count}</p>
        <p>User Follows Business: {profileData.is_user_follow_business ? 'Yes' : 'No'}</p>
        <p>Business Follows User: {profileData.is_business_follow_user ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
