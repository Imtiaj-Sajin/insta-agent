import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { pool } from "@/database/dbc"; // Import your MySQL pool


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pageaccesstoken, adminid } = body;

    if (!pageaccesstoken || !adminid) {
      return NextResponse.json(
        { error: "'pageAccessToken' is required" },
        { status: 400 }
      );
    }

    // Save the token in the database (upsert equivalent in MySQL)
    const [existingRow]: any = await pool.promise().query(
      "SELECT * FROM Automationsettings WHERE adminid = ?",
      [adminid]
    );

    if (existingRow.length > 0) {
      // Update if the adminid already exists
      await pool.promise().execute(
        "UPDATE Automationsettings SET pageaccesstoken = ? WHERE adminid = ?",
        [pageaccesstoken, adminid]
      );
    } else {
      // Insert if the adminid doesn't exist
      await pool.promise().execute(
        "INSERT INTO Automationsettings (pageaccesstoken, adminid) VALUES (?, ?)",
        [pageaccesstoken, adminid]
      );
    }

    console.log("Page access token saved for adminid:", adminid);
    return NextResponse.json(
      { message: "Page access token saved successfully" },
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
