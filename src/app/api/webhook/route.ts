//app/api/webhook/route.ts
import { NextRequest } from 'next/server';
import crypto, { randomInt } from 'crypto';

const VERIFY_TOKEN = 'v_token'; 
const APP_SECRET = process.env.NEXT_PUBLIC_FACEBOOK_APP_SECRET || ''; 
let PAGE_ACCESS_TOKEN:any

const keywords = ["sale", "discount", "offer"];
const responses = [
  "Thank you for your comment!",
  "We appreciate your interest.",
  "Stay tuned for more updates!",
  "That's great to hear!",
  "Thanks for reaching out!",
  "Let us know if you have any questions.",
  "We're glad you noticed!",
  "Keep following us for more news.",
  "Your feedback means a lot!",
  "Don't miss our upcoming events!",
];

export async function GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const mode = searchParams.get('hub.mode');
      const token = searchParams.get('hub.verify_token');
      const challenge = searchParams.get('hub.challenge');
      const headers = req.headers; 
      
      console.log('Received GET Request:');
      console.log('Mode:', mode);
      console.log('Token:', token);
      console.log('Challenge:', challenge);
      console.log('Expected VERIFY_TOKEN:', VERIFY_TOKEN);
      console.log('Request Headers:', headers);
  
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook verified');
        return new Response(challenge, { status: 200 });
      } else {
        console.error('Verification failed');
        return new Response('Forbidden', { status: 403 });
      }
    } catch (error) {
      console.error('Error in GET verification:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
  

export async function POST(req: NextRequest) {
  PAGE_ACCESS_TOKEN=req.cookies.get('longLivedToken')?.value || null
  PAGE_ACCESS_TOKEN='EAAnZByvmjelsBOZCS79aRQzzj3IX4iKTkwpCNYjskuCBiGqXfcczhEfK7KUk4LGA2ILwFIgXogF6Yq2R3UiwvOFLD2iNHznkUQk1VXpVaFEf77Glf5qu2wUZCT7yBbb5pn5VwamoFa3Ajhnsq4NJZC0kZCuM6RItbjhZBfZBKJYw25uUH1chEgeTFNSfZAR8lHkZD'
  // console.log("page access token from post: ", PAGE_ACCESS_TOKEN)
    try {
      const body = await req.text(); // Capture raw body
      const signature = req.headers.get('x-hub-signature-256') || ''; 
  
      // console.log('Received POST Request:');
      // console.log('Body:', body);
      // console.log('Signature:', signature);
  
      if (!verifySignature(body, signature)) {
        console.error('Signature verification failed');
        return new Response('Forbidden', { status: 403 });
      }
      console.log("webhook body: ",body)
      const payload = JSON.parse(body);
  
      const parsedData = parseWebhookPayload(payload);
      console.log("Parsed webhook payload:", parsedData);
      if(parsedData.mediaType==='FEED' && parsedData.username!=process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME){
          await fetch('https://j7f0x0n5-3000.asse.devtunnels.ms/api/storeWebhookComment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comment_id: parsedData.commentId,
            page_id: parsedData.pageId,
            media_id: parsedData.postId,
            media_type: parsedData.mediaType,
            user_id: parsedData.senderId,
            username: parsedData.username,
            parent_comment_id: parsedData.parentCommentId,
            comment_text: parsedData.text,
            event_time: parsedData.eventTime,
          }),
        });
      }

      if(parsedData.username!=process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME&&parsedData.commentId&&parsedData.postId==='18006198179676267')
      {
        const text=parsedData.text;
        const containsKeyword = keywords.some((keyword) =>
              text.toLowerCase().includes(keyword)
            );
        if(containsKeyword){

        const response = await replyToComment(parsedData.commentId, responses[randomInt(9)]);
        console.log("Reply response:", response);

        const dmResponse = await sendTextMessage(parsedData.senderId, `Hi ${parsedData.username}, thanks for your comment!`);
        console.log("DM response:", dmResponse);

        return new Response('Comment replied', { status: 200 });
        }
        return new Response('Comment not replied', { status: 200 });
      }
      else if(parsedData.commentId){return new Response('Comment replied', { status: 200 });}
      else{
        await fetch("https://j7f0x0n5-3001.asse.devtunnels.ms/api/sendMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: body }),
        });        
        return new Response('EVENT_RECEIVED', { status: 200 });
      }
    } 
    catch (error) {
      console.error('Error Handling POST Request:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
  


function verifySignature(payload: string, signature: string): boolean {
    const hash = crypto.createHmac('sha256', APP_SECRET).update(payload).digest('hex');
    const expectedSignature = `sha256=${hash}`;
    
    // Debugging: Log the calculated hash and incoming signature
    // console.log('Calculated Signature:', expectedSignature);
    // console.log('Received Signature:', signature);
    
    return expectedSignature === signature;
  }
  
// function parseWebhookPayload(payload:any) {
//   try {
//     const entry = payload.entry?.[0];
//     const changes = entry?.changes?.[0];
//     const commentId = changes?.value?.id;

//     return {
//       commentId,
//       postId: changes?.value?.media?.id,
//       text: changes?.value?.text,
//       username: changes?.value?.from?.username,
//       senderId: changes?.value?.from?.id,
//     };
//   } catch (error: any) {
//     console.error("Error parsing webhook payload:", error.message);
//     return {};
//   }
// }
function parseWebhookPayload(payload: any) {
  try {
    const entry = payload.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    return {
      commentId: value?.id,
      postId: value?.media?.id,
      text: value?.text,
      username: value?.from?.username,
      senderId: value?.from?.id,
      parentCommentId: value?.parent_id,
      mediaType: value?.media?.media_product_type,
      pageId: entry?.id,
      eventTime: payload?.entry?.[0]?.time,
    };
  } catch (error: any) {
    console.error("Error parsing webhook payload:", error.message);
    return {};
  }
}

export async function replyToComment(commentId:any, replyMessage:string) {
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
  } catch (error: any) {
    console.error("Error replying to comment:", error.message);
    throw error;
  }
}

export async function sendTextMessage(recipientId: string, newMessage: string) {
  if (!PAGE_ACCESS_TOKEN) {
    console.error('Access token is missing.');
    return;
  }

  const endpoint = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
  const payload = {
    recipient: { id: recipientId },
    message: { text: newMessage },
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Message sent successfully:', data);
      return { success: true, data };
    } else {
      console.error('Failed to send message:', data.error || 'Unknown error');
      return { success: false, error: data.error };
    }
  } catch (error:any) {
    console.error('Error sending message:', error.message);
    return { success: false, error: error.message };
  }
}
