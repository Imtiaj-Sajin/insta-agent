import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { pool } from "@/database/dbc"; // Import your MySQL pool

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET});
try {
    // Extract the token using NextAuth

    // If token doesn't exist, return 401 Unauthorized
    if (!token || !token.adminid) {
      return NextResponse.json({ error: 'Unauthorized: Token not found or invalid' }, { status: 401 });
    }

    const adminid = token.id; // Get admin ID from the token

    // Query the database to get the page access token
    const [rows]: any = await pool
      .promise()
      .execute('SELECT pageaccesstoken FROM Automationsettings WHERE adminid = ?', [adminid]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Page access token not found' }, { status: 404 });
    }

    // Return the page access token in the response
    const { pageaccesstoken } = rows[0];
    return NextResponse.json({
      adminid,
      pageAccessToken: pageaccesstoken,
    });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET});
  console.log("token 7th line ==> ", token);

  try {
    const body = await req.json();
    const { pageaccesstoken } = body;

    if (!pageaccesstoken) {
      return NextResponse.json(
        { error: "'pageAccessToken' is required" },
        { status: 400 }
      );
    }
    console.log("process.env.NEXTAUTH_SECRET =efewfe=> ", process.env.NEXTAUTH_SECRET);

    const adminid = 6; // Use adminid from the token
    // console.log("adminid ==> ", adminid);
    // console.log("token in upload-token api==> ", token);
    // if (!token || !token.adminid) {
    //   return NextResponse.json(
    //     { error: "Admin ID not found in the token" },
    //     { status: 401 }
    //   );
    // }



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
