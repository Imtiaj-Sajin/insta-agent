import { NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN = "EAAnZByvmjelsBOxp326pUSEyU45MvEDrsrFGfYjIUMaFjOtIKIGDZAPzf43al3kd4IBEvZBfoj6FZAGksBPotzKvCh0Oh5vNBf0xD1RAsHnzQRZBMk5cPpIdDevgjjdU9FqtQTyP1AGbX1rv2zibh72o8kc1diBq3nNKe8S4TkasTN9w8e82hLUVMFLNsFAsZD";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const mediaId = body.mediaId;
  
    if (!mediaId) {
      return NextResponse.json({ error: "Missing mediaId parameter" }, { status: 400 });
    }
  
    const response = await fetch(`https://graph.facebook.com/v21.0/${mediaId}?fields=permalink&access_token=${ACCESS_TOKEN}`);
    const data = await response.json();
  
    return NextResponse.json({ permalink: data.permalink });
  }
  