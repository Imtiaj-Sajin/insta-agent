//src/app/login/page.tsx

"use client"
import React from 'react';

const LoginPage = () => {
    const handleLogin = () => {
        const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
        const redirectUri = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI;
        const permissions = [
            'instagram_basic',
            'instagram_manage_messages',
            'pages_manage_metadata',
            'pages_show_list',
            'business_management'
        ].join(',');

        const loginUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${permissions}&response_type=code`;

        window.location.href = loginUrl;
    };

    return (
        <div>
            <h1>Login with Facebook</h1>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;
