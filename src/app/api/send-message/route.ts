import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Extract query parameters
    const urlParams = new URL(req.url).searchParams;
    const pageAccessToken = urlParams.get('accessToken');
    const recipientId = urlParams.get('recipientId'); // Instagram-scoped user ID (IGSID)

    console.log("send messge: ", pageAccessToken);
    console.log("send messge: ", recipientId);
    
    if (!pageAccessToken || !recipientId) {
      return NextResponse.json(
        { error: 'Page Access Token and Recipient ID are required.' },
        { status: 400 }
      );
    }

    // Parse the request body
    const { message, attachmentType, attachmentPayload } = await req.json();

    if (!message && !attachmentType) {
      return NextResponse.json(
        { error: 'Message text or attachment type is required.' },
        { status: 400 }
      );
    }

    // Build the payload
    const payload: any = {
      recipient: { id: recipientId },
    };

    if (message) {
      payload.message = { text: message };
    } else if (attachmentType && attachmentPayload) {
      payload.message = {
        attachment: {
          type: attachmentType,
          payload: attachmentPayload,
        },
      };
    }

    // Make the API request to send the message
    const response = await fetch(
      `https://graph.facebook.com/v17.0/me/messages?access_token=${pageAccessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || 'Failed to send message');
    }

    const result = await response.json();

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json(
      { error: `Failed to send message: ${error.message}` },
      { status: 500 }
    );
  }
}
