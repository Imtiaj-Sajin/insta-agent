import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret }); 

  if (token) {
    return NextResponse.json({ token });
  } else {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
