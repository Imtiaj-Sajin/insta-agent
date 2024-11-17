//src/app/api/fetch-messages/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    // Extract the access token and conversation ID from the query parameters
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const accessToken = urlParams.get('accessToken'); // Extract the access token from the URL
    const conversationId = urlParams.get('conversationId'); // Extract conversationId if provided

    if (!accessToken) {
        return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    // Construct the Instagram Graph API URL based on whether a conversationId is provided
    const url = conversationId
        ? `https://graph.facebook.com/v21.0/${conversationId}?fields=messages{from,to,message,created_time}&access_token=${accessToken}`
        : `https://graph.facebook.com/v21.0/me/conversations?platform=instagram&fields=id,messages{from,to,message,created_time},updated_time&access_token=${accessToken}`;

    console.log(
        conversationId
            ? `Fetching messages for conversation ID: ${conversationId}`
            : 'Fetching all conversations...'
    );

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log('Response:', data);

        if (response.ok) {
            return NextResponse.json(data);
        } else {
            console.error('Error fetching data:', data);
            return NextResponse.json({ error: 'Failed to fetch data', details: data }, { status: 400 });
        }
    } catch (error) {
        console.error('Error during API request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
