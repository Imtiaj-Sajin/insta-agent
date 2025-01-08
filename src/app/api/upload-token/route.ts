import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { pool } from "@/database/dbc"; // Import your MySQL pool

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pageaccesstoken } = body;

    if (!pageaccesstoken) {
      return NextResponse.json(
        { error: "'pageAccessToken' is required" },
        { status: 400 }
      );
    }

    const token = await getToken({ req });
    if (!token || !token.adminid) {
      return NextResponse.json(
        { error: "Admin ID not found in the token" },
        { status: 401 }
      );
    }

    const adminid = token.adminid; // Use adminid from the token
    console.log("adminid ==> ", adminid);

    // Save the token in the database (upsert equivalent in MySQL)
    const [existingRow]: any = await pool.promise().query(
      "SELECT * FROM automationsettings WHERE adminid = ?",
      [adminid]
    );

    if (existingRow.length > 0) {
      // Update if the adminid already exists
      await pool.promise().execute(
        "UPDATE automationsettings SET pageaccesstoken = ? WHERE adminid = ?",
        [pageaccesstoken, adminid]
      );
    } else {
      // Insert if the adminid doesn't exist
      await pool.promise().execute(
        "INSERT INTO automationsettings (pageaccesstoken, adminid) VALUES (?, ?)",
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
