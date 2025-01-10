import React from 'react';
import Image from 'next/image';
const ProfileCard = ({ profileData }: { profileData: any }) => {
  return (
    <span
      className="profile-card"
      style={{
        background: '#fff',
        boxShadow: '0px 0px 0px 0px rgba(255,255,255,0)',
        color: '#000',
        textAlign: 'center',
        padding: '30px',
        width: '350px',
        maxWidth: '100%',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center elements horizontally
      }}
    >
      {/* Profile Picture */}
      <div
        className="profile-pic"
        style={{
          border: '1px solid #ED4B00',
          borderRadius: '50%',
          padding: '7px',
          display: 'inline-block',
        }}
      >
        {/* <img
          src={profileData?.profile_pic || 'https://fakeimg.pl/300'}
          alt={`${profileData.name}'s Profile`}
          style={{
            borderRadius: '50%',
            width: '100px',
            height: '100px',
            objectFit: 'cover',
          }}
        /> */}
        <Image
        width={100}
        height={100}
          src={profileData?.profile_pic || 'https://fakeimg.pl/300'}
          alt={`${profileData.name}'s Profile`}
          style={{
            borderRadius: '50%',
            width: '100px',
            height: '100px',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Name and Username */}
      <h3 style={{ margin: '5px 0' }}>{profileData.name}</h3>
      <h6 style={{ margin: '5px 0', textTransform: 'uppercase' }}>
        @{profileData.username}
      </h6>
      {profileData.is_verified_user && (
        <span
          className="verified"
          style={{
            color: '#231E39',
            backgroundColor: '#FEBB0B',
            borderRadius: '3px',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '3px 7px',
            position: 'relative',
            marginTop: '10px',
            display: 'inline-block',
          }}
        >
          ✔ Verified
        </span>
      )}

      {/* Follower Information */}
      <p style={{ fontSize: '14px', lineHeight: '21px' }}>
        Followed by {profileData.follower_count} user(s)
      </p>

      {/* Buttons */}
      <div
        className="buttons"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '20px',
        }}
      >
        <button
          className="primary"
          style={{
            backgroundColor: '#ED4B00',
            border: '1px solid #fff',
            borderRadius: '10px',
            color: '#fff',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: '500',
            padding: '10px 25px',
          }}
        >
          View
        </button>
        <button
          className="primary ghost"
          style={{
            backgroundColor: 'transparent',
            color: '#ED4B00',
            border: '1px solid #ED4B00',
            borderRadius: '10px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: '500',
            padding: '10px 25px',
          }}
        >
          {profileData.is_business_follow_user ? 'Following' : 'Follow'}
        </button>
      </div>
    </span>
  );
};

export default ProfileCard;
