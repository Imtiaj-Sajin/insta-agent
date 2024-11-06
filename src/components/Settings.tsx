import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const accessToken = "IGQWRQQ1BpUnVoR0JFRF9NdnE0U0c5aVdTekNDeGsxMjRmTWNFMGpEVVRoTWYwREhrbm1RR09obkxRVFdFcjZANR3FUX003R28yVm9WaGlURGtlLWhzLWVvQmlUa1J5ZAldSZAnpiZAjNBV1dDdGtJenphbVIwLU1hcG8ZD"; // Replace with your actual token

  useEffect(() => {
    // Function to fetch Instagram username
    const fetchInstagramData = async () => {
      try {
        const response = await axios.get(
          `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
        );
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching Instagram data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramData();
  }, []);

  return (
    <div className="settings-content">
      <h1>Settings</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>Connected Instagram Account: {username}</p>
      )}
    </div>
  );
};

export default Settings;
