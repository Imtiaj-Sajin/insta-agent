import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { pool } from "@/database/dbc"; // Import your MySQL connection pool

// GET request: Fetch automation settings by adminId
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  try {
    if (!token || !token.id) {
      return NextResponse.json(
        { error: "Unauthorized: Token not found or invalid" },
        { status: 401 }
      );
    }

    const adminId = token.id;

    // Query the database to fetch automation settings
    const [rows]: any = await pool
      .promise()
      .execute("SELECT * FROM Automationsettings WHERE adminid = ?", [adminId]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST request: Save or update automation settings
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  try {
    if (!token || !token.id) {
      return NextResponse.json(
        { error: "Unauthorized: Token not found or invalid" },
        { status: 401 }
      );
    }

    const adminId = token.id;
    const body = await req.json();
    console.log("Parsed body ==> ", body);

    const dailyauto = Number(body.dailyauto);
    const cycle = Number(body.cycle);
    const notaskrest = Number(body.notaskrest);
    const messagemin = Number(body.messagemin);
    const messagemax = Number(body.messagemax);
    const commentmin = Number(body.commentmin);
    const commentmax = Number(body.commentmax);

    if (
      isNaN(dailyauto) ||
      isNaN(cycle) ||
      isNaN(notaskrest) ||
      isNaN(messagemin) ||
      isNaN(messagemax) ||
      isNaN(commentmin) ||
      isNaN(commentmax)
    ) {
      return NextResponse.json(
        { error: "Invalid data: one or more fields are not numbers" },
        { status: 400 }
      );
    }

    // Check if a record exists for the adminId
    const [existingRecords]: any = await pool
      .promise()
      .execute("SELECT id FROM Automationsettings WHERE adminid = ?", [
        adminId,
      ]);

    if (existingRecords.length > 0) {
      const recordId = existingRecords[0].id;

      // Update the existing record
      await pool
        .promise()
        .execute(
          `
          UPDATE Automationsettings 
          SET dailyauto = ?, cycle = ?, notaskrest = ?, messagemin = ?, messagemax = ?, commentmin = ?, commentmax = ? 
          WHERE id = ?`,
          [
            dailyauto,
            cycle,
            notaskrest,
            messagemin,
            messagemax,
            commentmin,
            commentmax,
            recordId,
          ]
        );

      console.log("Updated existing record with ID:", recordId);
      return NextResponse.json(
        {
          message: "Settings updated successfully",
          adminid: adminId,
          updatedFields: {
            dailyauto,
            cycle,
            notaskrest,
            messagemin,
            messagemax,
            commentmin,
            commentmax,
          },
        },
        { status: 200 }
      );
    } else {
      // Insert a new record
      await pool
        .promise()
        .execute(
          `
          INSERT INTO Automationsettings (adminid, dailyauto, cycle, notaskrest, messagemin, messagemax, commentmin, commentmax) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            adminId,
            dailyauto,
            cycle,
            notaskrest,
            messagemin,
            messagemax,
            commentmin,
            commentmax,
          ]
        );

      console.log("Created new record for adminId:", adminId);
      return NextResponse.json(
        {
          message: "Settings saved successfully",
          adminid: adminId,
          newFields: {
            dailyauto,
            cycle,
            notaskrest,
            messagemin,
            messagemax,
            commentmin,
            commentmax,
          },
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
