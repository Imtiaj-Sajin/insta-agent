"use client"
import { cookies } from "next/headers";
import { useEffect } from "react";
import io from "socket.io-client";

// Replace with your server URL
const socket = io("https://nkf448kn-3001.asse.devtunnels.ms/");

export default function WebhookHandler() {
  useEffect(() => {
    socket.on("receiveMessage", async (data) => {
      console.log("Received data:", data);

      try {
        const parsedData = parseWebhookPayload(JSON.parse(data));
        console.log("Parsed webhook payload:", parsedData);

        if (parsedData.commentId) {
          const response = await replyToComment(parsedData.commentId);
          console.log("Reply response:", response);
        }
      } catch (error) {
        console.error("Error processing webhook:", error.message);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return null;
}

// Helper: Parse webhook payload
function parseWebhookPayload(payload) {
  try {
    const entry = payload.entry?.[0];
    const changes = entry?.changes?.[0];
    const commentId = changes?.value?.id;

    return {
      commentId, // The ID of the comment to reply to
      postId: changes?.value?.media?.id,
      text: changes?.value?.text,
      username: changes?.value?.from?.username,
    };
  } catch (error) {
    console.error("Error parsing webhook payload:", error.message);
    return {};
  }
}

// Helper: Reply to the comment
async function replyToComment(commentId) {
  const PAGE_ACCESS_TOKEN = (await cookies()).get("pageAccessToken")?.value;
  if (!PAGE_ACCESS_TOKEN) {
    console.error("Access token is missing from cookies");
    throw new Error("Access token is required");
  }

  const replyMessage = "Hi, thanks a lot for reaching out!";
  const url = `https://graph.facebook.com/v21.0/${commentId}/replies`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: replyMessage,
        access_token: PAGE_ACCESS_TOKEN,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error.message || "Failed to reply to the comment");
    }

    return data; // Reply ID if successful
  } catch (error) {
    console.error("Error replying to comment:", error.message);
    throw error;
  }
}
