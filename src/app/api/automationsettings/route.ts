import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the import based on your prisma setup
import { getToken } from "next-auth/jwt";

// GET request: Fetch automation settings by adminId
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  try {
    const data = await prisma.automationsettings.findFirst({
      where: { adminid: token?.id||0 },
    });

    if (!data) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  try {
    const adminId = token?.id; 
    const body = await req.json();
    console.log("Parsed body ==> ", body);

    const dailyauto = Number(body.dailyauto);
    const cycle = Number(body.cycle);
    const notaskrest = Number(body.notaskrest);
    const messagemin = Number(body.messagemin);
    const messagemax = Number(body.messagemax);
    const commentmin = Number(body.commentmin);
    const commentmax = Number(body.commentmax);

    if (isNaN(dailyauto) || isNaN(cycle) || isNaN(notaskrest) || isNaN(messagemin) || isNaN(messagemax) || isNaN(commentmin) || isNaN(commentmax)) {
      return NextResponse.json(
        { error: "Invalid data: dailyauto, cycle, or notaskrest is not a number" },
        { status: 400 }
      );
    }

    // Check if the record exists
    const existingRecord = await prisma.automationsettings.findFirst({
      where: { adminid: adminId },
    });

    let updatedSettings;

    if (existingRecord) {
      console.log("Updating existing record with ID: ", existingRecord.id);
      updatedSettings = await prisma.automationsettings.update({
        where: { id: existingRecord.id }, // Use the unique `id` field for updating
        data: {
          dailyauto,
          cycle,
          notaskrest,
          messagemin,
          messagemax,
          commentmin,
          commentmax,
        },
      });
    } else {
      console.log("Creating new record with adminId: ", adminId);
      updatedSettings = await prisma.automationsettings.create({
          data: {
          adminid: adminId,  // Ensure you provide a valid adminId
          dailyauto: dailyauto,
          cycle: cycle,
          notaskrest: notaskrest,
          messagemin: messagemin,
          messagemax: messagemax,
          commentmin: commentmin,
          commentmax: commentmax,
        }
      });
    }
    console.log("Updated settings: ", updatedSettings);
    return NextResponse.json(updatedSettings, { status: 200 });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
