import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    // const ACCESS_TOKEN = req.cookies.get('pageAccessToken')?.value
    const ACCESS_TOKEN = "EAAnZByvmjelsBO0K1CN86Vi3ZCpP4beK5XZAjaAuUlvEg4vSvZAGOKJYChHToqnYaEtF3dNjSC37n0HhH860FmBj586ZCDqfIVdhoMgk5WGtgRNOELbYW8HQ4lwZAxtTH5ROi0K3dlgk53RfEuOlInVQmJMkGX7LoxvAPktwwT1tVFgS5kidnkvO2PSOQvRZCSNycmODYfhJd4ZCNczcONZAOLJoZD"
    console.log("ACCESS_TOKEN yyyyyy ==> ", ACCESS_TOKEN);
    // const ACCESS_TOKEN = req.nextUrl.searchParams.get("accessToken")

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${process.env.NEXT_PUBLIC_INSTAGRAM_USERID}?fields=media{caption}&access_token=${ACCESS_TOKEN}`
    );
    
    if (!response.ok) {
        const errorData = await response.json();
        return new Response(JSON.stringify({ error: errorData.error.message || "An error occurred" }), {
          status: response.status,
        });
      }
  
      const data = await response.json();
      return new Response(JSON.stringify({ data }), { status: 200 });
    } catch (error) {
      console.error("Fetch error:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  }