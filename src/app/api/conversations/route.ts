import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const ACCESS_TOKEN = req.cookies.get('pageAccessToken')?.value;
  const INSTAGRAM_USERID = process.env.NEXT_PUBLIC_INSTAGRAM_USERID;

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/me/conversations?fields=participants,messages.limit(1){message},id,name,updated_time,wallpaper&platform=instagram&limit=10&access_token=${ACCESS_TOKEN}`
    );

    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error.message }), { status: response.status });
    }

    const participantCache: Record<string, any> = {}; // Caching participant details

    const conversations = await Promise.all(
      data.data.map(async (conversation: any) => {
        const participant = conversation.participants?.data?.find(
          (p: any) => p.id !== INSTAGRAM_USERID
        );

        if (participant?.id && !participantCache[participant.id]) {
          const userResponse = await fetch(
            `https://graph.facebook.com/v21.0/${participant.id}?access_token=${ACCESS_TOKEN}`
          );
          const userData = await userResponse.json();
          participantCache[participant.id] = userResponse.ok ? userData : null;
        }

        return {
          id: conversation.id,
          name: participant?.name || conversation.name,
          updated_time: conversation.updated_time,
          last_message: conversation.messages?.data[0]?.message,
          participant_details: participantCache[participant?.id] || null,
        };
      })
    );

    return new Response(JSON.stringify(conversations), { status: 200 });
  } catch (error) {
    console.error('Error in /api/conversations:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
