// src/app/api/get-tokens/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt'; 
import { pool } from '@/database/dbc'; 

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET});
    console.log("token GET get-tokens==> ", token);

    if (!token || !token.id) {
      return NextResponse.json({ error: 'Unauthorized: Token not found or invalid' }, { status: 401 });
    }

    const adminid = token.id; // Get admin ID from the token

    const [rows]: any = await pool
      .promise()
      .execute('SELECT pageaccesstoken FROM Automationsettings WHERE adminid = ?', [adminid]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Page access token not found' }, { status: 404 });
    }
    console.log("rows : ", rows)

    const { pageaccesstoken } = rows[0];
    // return NextResponse.json({
    //   adminid,
    //   pageAccessToken: pageaccesstoken,
    // });
    const res = NextResponse.json({ success: true, pageAccessToken: pageaccesstoken });
        
    res.cookies.set('adminid', adminid as string, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 60, // 60 days
    });

    res.cookies.set('pageAccessToken', pageaccesstoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 60, // 60 days
    });

    return res;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
