// src/app/api/get-tokens/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const longLivedToken = req.cookies.get('longLivedToken')?.value || null;
    const pageAccessToken = req.cookies.get('pageAccessToken')?.value || null;

    if (!longLivedToken || !pageAccessToken) {
        return NextResponse.json({ error: 'Tokens not found' }, { status: 401 });
    }

    return NextResponse.json({
        longLivedToken,
        pageAccessToken,
    });
}
