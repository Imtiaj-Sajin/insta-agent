import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    // const ACCESS_TOKEN = req.cookies.get('longLivedToken')?.value
    const ACCESS_TOKEN = "EAAnZByvmjelsBOzt7hEeiw53adbnJJmchgbQYB4mfgzvWYLXmEHEiZC2sSpNG5XBcTiQx9yttWBUyJpuLAlyK2gtYub76X1IZAoot9ZAJUX47SF0vwHC3aAO99bLQSd4THXotYgERcpCcuUgnowgcvySuZADzkasUmGVf9RjBx48v3Jx7p6sFTaWMMwVGzkEZD"
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