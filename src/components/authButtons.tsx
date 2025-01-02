"use client";

import Image from "next/image";
import googleLogo from "../../public/google.png";
import githubLogo from "../../public/github.png";
import { signIn } from "next-auth/react";
import styles from '../app/style.module.css';

export function GoogleSignInButton() {
  const handleClick = () => {
    signIn("google", { callbackUrl: '/admin/dashboard' });
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl  transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200"
    >
      <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
      <span className="ml-4">Continue with Google</span>
    </button>
  );
}

export function ModeratorSignInButton() {
  const handleClick = () => {
    // signIn();
    signIn(undefined, { callbackUrl: '/moderator/dashboard' });

  };

  return (
    <button
      onClick={handleClick}
      className={styles.mButton}
    >
      {/* <Image src={githubLogo} alt="Github Logo" width={20} height={20} /> */}
      <img className={styles.svgIcon}  src="https://img.icons8.com/glyph-neue/64/lifecycle--v1.png" alt="lifecycle--v1"/>

      <span className="ml-4">Moderator</span>
    </button>
  );
}
