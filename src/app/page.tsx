import React from 'react';
import styles from './style.module.css';
import Link from "next/link";

// -------w---
import Image from "next/image";
import googleLogo from "@/public/google.png";
import githubLogo from "@/public/github.png";
import {
  ModeratorSignInButton,
  GoogleSignInButton,
} from "@/components/authButtons";

import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CredentialsForm } from "@/components/credentialsForm";
import { getCsrfToken } from "next-auth/react";

// export default async function SignInPage() {
 

// import './../styles/globals.css';
const HomePage = async() => {
    
    const session = await getServerSession(authConfig);
    console.log("Session: ", session);

    if (session) return redirect("/admin/dashboard");

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div  className={styles.logo} >
          <svg xmlns="http://www.w3.org/2000/svg" width="82" height="60" fill="none" viewBox="0 0 82 40"><path fill="#FFD43D" d="M73.365 19.71c0 2.904-2.241 5.31-5.27 5.31-3.03 0-5.228-2.406-5.228-5.31 0-2.905 2.199-5.312 5.228-5.312s5.27 2.407 5.27 5.311Z"></path><path fill="#FF0C81" d="M48.764 19.544c0 2.946-2.323 5.145-5.27 5.145-2.904 0-5.227-2.2-5.227-5.145 0-2.947 2.323-5.104 5.228-5.104 2.946 0 5.27 2.158 5.27 5.104Z"></path><path fill="#11EEFC" d="M20.074 25.02c3.029 0 5.27-2.406 5.27-5.31 0-2.905-2.241-5.312-5.27-5.312-3.03 0-5.228 2.407-5.228 5.311 0 2.905 2.199 5.312 5.228 5.312Z"></path><path fill="#171A26" d="M68.095 30.54c-6.307 0-11.12-4.897-11.12-10.872 0-5.934 4.855-10.83 11.12-10.83 6.349 0 11.162 4.938 11.162 10.83 0 5.975-4.855 10.871-11.162 10.871Zm0-5.52c3.03 0 5.27-2.406 5.27-5.31 0-2.905-2.24-5.312-5.27-5.312-3.029 0-5.228 2.407-5.228 5.311 0 2.905 2.199 5.312 5.228 5.312ZM43.08 40c-4.813 0-8.506-2.116-10.373-5.934l4.896-2.655c.913 1.784 2.614 3.195 5.394 3.195 3.486 0 5.85-2.448 5.85-6.473v-.374c-1.12 1.411-3.111 2.49-6.016 2.49-5.768 0-10.373-4.481-10.373-10.581 0-5.934 4.813-10.788 11.12-10.788 6.431 0 11.162 4.605 11.162 10.788v8.299C54.74 35.27 49.76 40 43.08 40Zm.415-15.311c2.946 0 5.27-2.2 5.27-5.145 0-2.947-2.324-5.104-5.27-5.104-2.905 0-5.228 2.158-5.228 5.104s2.323 5.145 5.228 5.145ZM20.074 30.54c-6.307 0-11.12-4.897-11.12-10.872 0-5.934 4.854-10.83 11.12-10.83 6.348 0 11.162 4.938 11.162 10.83 0 5.975-4.855 10.871-11.162 10.871Zm0-5.52c3.029 0 5.27-2.406 5.27-5.31 0-2.905-2.241-5.312-5.27-5.312-3.03 0-5.228 2.407-5.228 5.311 0 2.905 2.199 5.312 5.228 5.312ZM0 0h5.892v30H0V0ZM82 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"></path></svg>
        </div>

        <img src="/rb_4898.png" style={{width:"60%"}}/>
        <h1>Where would you like to start?</h1>
        <p>Don’t worry, you can connect other channels later.</p>
      </div>

      {/* ----------------right-------------------- */}
      <div className={styles.right}>

        <ModeratorSignInButton />


        <Link className={styles.privacy} href="/privacy-policy">
            Privacy Policy
          </Link>


        <div className={styles.option}>
          <div className={styles.icon}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1024px-Instagram_icon.png" alt="Instagram" />
          </div>
          <div>
            <h3>Instagram</h3>
            <p>Supercharge your social media marketing with Instagram Automation.</p>
          </div>
        </div>
        <div className={styles.option}>
          <div className={styles.icon}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png" alt="Facebook Messenger" />
          </div>
          <div>
            <h3>Facebook Messenger</h3>
            <p>Create Facebook Messenger automation to keep customers happy.</p>
          </div>
        </div>
        <div className={styles.option}>
          <div className={styles.icon}>
            <img src="/icons8-whatsapp-240.png" alt="WhatsApp" />
          </div>
          <div>
            <h3>WhatsApp</h3>
            <p>
              Choose the most popular mobile messaging app in the world and reach 2 billion users.
            </p>
          </div>
        </div>

    <div className="flex flex-col items-center mt-10 p-10 shadow-md">
        <h1 className="mt-10 mb-4 text-4xl font-bold">Sign In</h1>
          <GoogleSignInButton />
        <span className="text-2xl font-semibold text-white text-center mt-8">
          Or
        </span>
          <CredentialsForm />
      </div>
      
      </div>
    </div>
  );
};

export default HomePage;
