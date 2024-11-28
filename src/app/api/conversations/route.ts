import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
    const ACCESS_TOKEN = req.cookies.get('pageAccessToken')?.value

  try {
    // Fetch Instagram conversations with the required fields
    const response = await fetch(
      `https://graph.facebook.com/v21.0/me/conversations?fields=messages.limit(1){message},id,name,updated_time,wallpaper&platform=instagram&limit=10&access_token=${ACCESS_TOKEN}`
    );
    
    const data = await response.json();
    console.log(data)
    
    if (!response.ok) {
      console.log("response errorrrrr");
      console.error('Error fetching conversations:', data.error);
      return new Response(JSON.stringify({ error: data.error.message }), { status: response.status });
    }

    // Transform and structure the data for easier access
    const conversations = data.data.map((conversation: any) => ({
      id: conversation.id,
      name: conversation.name,
      updated_time: conversation.updated_time,
      last_message: conversation.messages?.data[0]?.message, // Get the last message from the conversation
      profile_picture: conversation.wallpaper?.url || null, // Fetch the profile picture if available
    }));
    console.log(conversations);
    return new Response(JSON.stringify(conversations), { status: 200 });
  } catch (error) {
    console.error('Error in /api/conversations:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
