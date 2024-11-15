import React from 'react';
import { FaUser, FaCalendarAlt, FaEnvelope } from 'react-icons/fa';
import './profile.css';

const ModeratorProfile = () => {
  return (
    <div className="profile-container p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
      <div className="profile-header flex items-center justify-between mb-6">
        <div className="avatar-container flex items-center" style={{}}>
          <img
            src="https://headshots-inc.com/wp-content/uploads/2023/03/professional-Headshot-Example-4-1.jpg"
            alt="Moderator Avatar"
            className="avatar w-16 h-16 rounded-full mr-4"
          />
          <div id='man' >
            <h2 className="text-xl font-semibold">John Doe</h2>
            <p className="text-gray-600">Moderator</p>
          </div>
        </div>
        <button className="edit-button text-white bg-blue-500 py-2 px-4 rounded-full hover:bg-blue-600">
          Edit
        </button>
      </div>

      <div className="profile-details space-y-4">
        <div className="detail-item flex items-center space-x-2">
          <FaUser className="text-gray-600" />
          <p className="text-gray-800">Username: sajin123</p>
        </div>
        <div className="detail-item flex items-center space-x-2">
          <FaCalendarAlt className="text-gray-600" />
          <p className="text-gray-800">Member Since: January 2025</p>
        </div>
        <div className="detail-item flex items-center space-x-2">
          <FaEnvelope className="text-gray-600" />
          <p className="text-gray-800">Email: imtiajsajin@gmail.com</p>
        </div>
      </div>

      <div className="stats mt-6 grid grid-cols-2 gap-4">
        <div className="stat-item text-center bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-600">Messages Handled</h3>
          <p className="text-xl font-semibold">1,258</p>
        </div>
        <div className="stat-item text-center bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-600">Reports Solved</h3>
          <p className="text-xl font-semibold">57</p>
        </div>
      </div>
    </div>
  );
};

export default ModeratorProfile;
