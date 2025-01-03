const pool  = require('../database/dbc.js'); // Adjust the path to your connection file
//const fetch = require('node-fetch');
const { randomInt } = require('crypto');

// Constants for delay
const MIN_DELAY = 20000; // 20 seconds
const MAX_DELAY = 60000; // 60 seconds

const PAGE_ACCESS_TOKEN = "EAAnZByvmjelsBOZCS79aRQzzj3IX4iKTkwpCNYjskuCBiGqXfcczhEfK7KUk4LGA2ILwFIgXogF6Yq2R3UiwvOFLD2iNHznkUQk1VXpVaFEf77Glf5qu2wUZCT7yBbb5pn5VwamoFa3Ajhnsq4NJZC0kZCuM6RItbjhZBfZBKJYw25uUH1chEgeTFNSfZAR8lHkZD"; // Replace with your actual token
async function replyToComment(commentId, replyMessage) {
  try {
    if (!PAGE_ACCESS_TOKEN) {
      console.error("Access token is missing from cookies");
      throw new Error("Access token is required");
    }

    const url = `https://graph.facebook.com/v21.0/${commentId}/replies`;

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

    return data;
  } catch (error) {
    console.error("Error replying to comment:", error.message);
    throw error;
  }
}

async function sendTextMessage(recipientId, newMessage) {
  if (!PAGE_ACCESS_TOKEN) {
    console.error("Access token is missing.");
    return;
  }

  const endpoint = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
  const payload = {
    recipient: { id: recipientId },
    message: { text: newMessage },
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Message sent successfully:", data);
      return { success: true, data };
    } else {
      console.error("Failed to send message:", data.error || "Unknown error");
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error("Error sending message:", error.message);
    return { success: false, error: error.message };
  }
}

async function fetchLatestComment() {
  let connection;
  try {

    const [rows] = await  pool.query(
      'SELECT * FROM webhook_comments ORDER BY event_time ASC LIMIT 1'
    );
    console.log("asdfsdfd: ", rows)
    if (rows.length > 0) {
      return rows[0]; // Return the latest comment
    }
    return null; // No rows found
  } catch (error) {
    console.error('Error fetching from database:', error.message);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function callMatchAutomationInstance(media_id, comment_text, comment_id, user_id) {
  try {
    const response = await fetch('http://localhost:3000/api/matchAutomationInstance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({ media_id, comment_text }),
      body: JSON.stringify({
        "media_id": media_id,
        "comment_text": comment_text
      }
      ),
    });

    if (!response.ok) {
      console.error('Error from matchAutomationInstance:', response.statusText);
      return;
    }

    const result = await response.json();
    console.log('Response from matchAutomationInstance:', result);

    const { comment_answers, dm_answers } = result;

    if (comment_answers && comment_answers.length > 0) {
      const randomComment = comment_answers[Math.floor(Math.random() * comment_answers.length)];
      console.log(`Replying to comment ${comment_id} with:`, randomComment);
      // Add your replyToComment function call here
      await replyToComment(comment_id, randomComment)
    }

    if (dm_answers && dm_answers.length > 0) {
      const randomDM = dm_answers[Math.floor(Math.random() * dm_answers.length)];
      console.log(`Sending DM to ${user_id} with:`, randomDM);
      // Add your sendTextMessage function call here
      await sendTextMessage(user_id, randomDM)
    }
    await deleteProcessedRow(comment_id);
  } catch (error) {
    console.error('Error in callMatchAutomationInstance:', error.message);
  }
}
async function deleteProcessedRow(comment_id) {
  try {
    const query = 'DELETE FROM webhook_comments WHERE comment_id = ?';
    const [result] = await pool.query(query, [comment_id]);

    console.log(`Deleted row with comment_id: ${comment_id}`);
    return result;
  } catch (error) {
    console.error(`Error deleting row with comment_id ${comment_id}:`, error.message);
    throw error;
  }
}

async function backgroundTaskAutoDMCM() {
  while (true) {
    try {
      const latestComment = await fetchLatestComment();

      if (latestComment) {
        const { media_id, comment_text, comment_id, user_id } = latestComment;

        console.log('Processing comment:', latestComment);

        // Process the comment
        await callMatchAutomationInstance(media_id, comment_text, comment_id, user_id);
      } else {
        console.log('No new comments found.');
      }
    } catch (error) {
      console.error('Error in background task:', error.message);
    }

    // Random delay between tasks
    const delay = randomInt(MIN_DELAY, MAX_DELAY);
    console.log(`Waiting for ${delay / 1000} seconds before the next task...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

module.exports = backgroundTaskAutoDMCM;
