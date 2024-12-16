//api/fetch-message-scroll/route.ts

  import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Extract access token and conversation ID from query parameters and cookies
    const urlParams = new URL(req.url).searchParams;
    const nextUrl = urlParams.get('nextUrl'); // Handle pagination if provided
    const conversationId=  "aWdfZAG06MTpJR01lc3NhZA2VUaHJlYWQ6MTc4NDE0NzAyOTI1MzQ5MzY6MzQwMjgyMzY2ODQxNzEwMzAxMjQ0Mjc2MDIzNzAzMDk3NDMwMDYx";
    const accessToken= "EAAnZByvmjelsBO6405XbInlm6q1SZBnzZBU4Hz2Y8jtiiVvPvZCxkMEMEREGtwWx4oIbzBoxA5ZCpKU0lte1zCaPoTEJqRRfMBZAmCgvHVUt46klYGMWZC82b951bPtaZA4LjOQhZAdyCffd44pJIAZARaZBC85czhS09UPHdnenDHda1gA5tGHwbhMt6JFcbIEDLsr6IgFkZAbtgz3LjZAyKRpyonMwZD"


    // Validate required parameters
    if (!accessToken || !conversationId) {
      return NextResponse.json(
        { error: 'Access token and conversationId are required' },
        { status: 400 }
      );
    }

    // Construct the Instagram Graph API URL
    const apiUrl = nextUrl
      ? nextUrl // Use the next URL for pagination
      : `https://graph.facebook.com/v21.0/${conversationId}?fields=messages{from,to,message,created_time,attachments}&access_token=${accessToken}`;

    // Fetch the messages from the Instagram Graph API
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching messages:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch messages', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error during API request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
