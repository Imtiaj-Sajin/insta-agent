import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the import path to your Prisma client
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pageaccesstoken } = body;

    // Validate the input
    if (!pageaccesstoken) {
      return NextResponse.json(
        { error: "'pageAccessToken' is required" },
        { status: 400 }
      );
    }

    // Get the token from the request
    const token = await getToken({ req });
    
    if (!token || !token.adminid) {
      return NextResponse.json(
        { error: "Admin ID not found in the token" },
        { status: 401 }
      );
    }

    const adminid = token.id;
    console.log("adminid ==> ", adminid);

    // Save the token in the database
    const savedToken = await prisma.automationsettings.upsert({
      where: { adminid: adminid }, // Use adminid from the token
      update: { pageaccesstoken, adminid },
      create: { pageaccesstoken, adminid },
    });

    console.log("Page access token saved:", savedToken.pageaccesstoken);
    return NextResponse.json(
      { message: "Page access token saved successfully", savedToken },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving page access token:", error);
    return NextResponse.json(
      { error: "Failed to save page access token" },
      { status: 500 }
    );
  }
}
