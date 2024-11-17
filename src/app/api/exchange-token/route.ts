// src/app/api/exchange-token/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const code = body.code; // Access the code from the request body

    if (!code) {
        return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
    }

    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const appSecret = process.env.NEXT_PUBLIC_FACEBOOK_APP_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI;

    // Step 1: Exchange code for short-lived token
    const tokenExchangeUrl = `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${appId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`;

    try {
        const response = await fetch(tokenExchangeUrl);
        const tokenData = await response.json();

        if (!tokenData.access_token) {
            console.log('Short-lived token exchange failed:', tokenData);
            return NextResponse.json({ error: 'Failed to obtain access token', details: tokenData }, { status: 400 });
        }

        console.log('Short-lived token generated:', tokenData.access_token);

        // Step 2: Exchange short-lived token for a long-lived token
        const longLivedTokenUrl = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${tokenData.access_token}`;

        const longLivedTokenResponse = await fetch(longLivedTokenUrl);
        const longLivedTokenData = await longLivedTokenResponse.json();

        if (!longLivedTokenData.access_token) {
            console.log('Long-lived token exchange failed:', longLivedTokenData);
            return NextResponse.json({ error: 'Failed to obtain long-lived access token', details: longLivedTokenData }, { status: 400 });
        }
        console.log('Long-lived token generated:', longLivedTokenData.access_token);

        // Step 3: Use long-lived token to get page access token
        const pagesUrl = `https://graph.facebook.com/v21.0/me/accounts?access_token=${longLivedTokenData.access_token}`;

        const pagesResponse = await fetch(pagesUrl);
        const pagesData = await pagesResponse.json();

        if (!pagesData.data || pagesData.data.length === 0) {
            console.log('No pages found for the user');
            return NextResponse.json({ error: 'No pages found' }, { status: 400 });
        }

        // Assuming you want the first page, you can modify this logic to handle multiple pages
        const pageAccessToken = pagesData.data[0].access_token;

        if (!pageAccessToken) {
            return NextResponse.json({ error: 'Page access token not found' }, { status: 400 });
        }

        console.log('Page access token:', pageAccessToken);

        // Return both the long-lived user access token and the page access token
        return NextResponse.json({ access_token: longLivedTokenData.access_token, page_access_token: pageAccessToken });

    } catch (error) {
        console.error('Token exchange error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
