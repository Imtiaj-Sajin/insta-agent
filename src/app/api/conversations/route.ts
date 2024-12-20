import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const ACCESS_TOKEN = req.cookies.get('pageAccessToken')?.value
    // const ACCESS_TOKEN = req.nextUrl.searchParams.get("accessToken")

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/me/conversations?fields=participants,messages.limit(1){message},id,name,updated_time,wallpaper&platform=instagram&limit=10&access_token=${ACCESS_TOKEN}`
    );
    
    const data = await response.json();    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error.message }), { status: response.status });
    }

    const conversations = await Promise.all(
      data.data.map(async (conversation: any) => {
        const participant = conversation.participants?.data?.find(
          (p: any) => p.id !== process.env.NEXT_PUBLIC_INSTAGRAM_USERID  
        );

        let participantDetails = null;

        if (participant?.id) {
          const userResponse = await fetch(
            `https://graph.facebook.com/v21.0/${participant.id}?access_token=${ACCESS_TOKEN}`
          );

          const userData = await userResponse.json();
          participantDetails = userResponse.ok ? userData : null;
        }

        return {
          id: conversation.id,
          name: participant?.name || conversation.name,
          updated_time: conversation.updated_time,
          last_message: conversation.messages?.data[0]?.message, 
          participant_details: participantDetails, 
        };
      })
    );

    console.log(conversations);
    return new Response(JSON.stringify(conversations), { status: 200 });
  } catch (error) {
    console.error('Error in /api/conversations:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
