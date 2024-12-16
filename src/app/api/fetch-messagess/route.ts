import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Extract access token and conversation ID from query parameters
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const accessToken = req.cookies.get('pageAccessToken')?.value;
  /* TAKE PAGEACCESSSTOKEN FROM URL !!!!!!dont remove the comment */
  const conversationId = urlParams.get('conversationId');
  

  // Validate required query parameters
  if (!accessToken || !conversationId) {
    return NextResponse.json({ error: 'Access token and conversationId are required' }, { status: 400 });
  }

  // Construct the Instagram Graph API URL to fetch the conversation messages
  const url = `https://graph.facebook.com/v21.0/${conversationId}?fields=messages{from,to,message,created_time,attachments}&access_token=${accessToken}`;

  try {
    // Make the request to the Instagram Graph API
    const response = await fetch(url);

    // If the response is successful
    if (response.ok) {
      const data = await response.json();
      // Return the messages in the response
      return NextResponse.json(data);
    } else {
      const errorData = await response.json();
      console.error('Error fetching messages:', errorData);
      return NextResponse.json({ error: 'Failed to fetch messages', details: errorData }, { status: 400 });
    }
  } catch (error) {
    console.error('Error during API request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
