import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the import based on your prisma setup
import { getToken } from "next-auth/jwt";

// GET request: Fetch automation settings by adminId
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  try {
    const data = await prisma.automationsettings.findFirst({
      where: { adminid: token?.id },
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
  try {
    // Mocking adminId for demonstration; replace with your token-based logic
    const adminId = 16; // Replace with token logic if necessary

    // Parse and log the request body
    const body = await req.json();
    console.log("Parsed body ==> ", body);

    // Convert body fields to numbers
    const dailyauto = Number(body.dailyauto);
    const cycle = Number(body.cycle);
    const notaskrest = Number(body.notaskrest);

    // Validate numeric fields
    if (isNaN(dailyauto) || isNaN(cycle) || isNaN(notaskrest)) {
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
      // Update existing record
      updatedSettings = await prisma.automationsettings.update({
        where: { id: existingRecord.id }, // Use the unique `id` field for updating
        data: {
          dailyauto,
          cycle,
          notaskrest,
        },
      });
    } else {
      // Create new record
      updatedSettings = await prisma.automationsettings.create({
        data: {
          adminid: adminId,
          dailyauto,
          cycle,
          notaskrest,
        },
      });
    }

    // Respond with the updated or created record
    return NextResponse.json(updatedSettings, { status: 200 });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
