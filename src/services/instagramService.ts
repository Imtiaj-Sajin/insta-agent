// src/services/instagramService.ts
import axios from 'axios';

const apiUrl = 'https://graph.facebook.com/v16.0';
const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

// Function to fetch all messages for the Instagram account
export async function fetchInstagramMessages() {
  try {
    const response = await axios.get(`${apiUrl}/${process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID}/conversations`, {
      params: {
        access_token: accessToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

// Additional functions for other API calls can be added here
